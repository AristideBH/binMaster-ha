"""Caching + midnight/notify scheduling for BinMaster.

One BinMasterCoordinator per (the single) ConfigEntry. It is push-driven
(update_interval=None): never polled, only recomputed at HA startup, once
daily at midnight, and whenever a bin-type subentry's data actually changes.

It also owns check-in state (checked_in/total_collections) — shared, single
source of truth for the sensor AND the check-in switch entity, persisted via
a Store rather than each entity's own RestoreEntity, so the two entities
can never desync (see docs/adr/0004-coordinator-owned-checkin-state.md).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, replace
from datetime import date, datetime, timedelta
from functools import partial
from typing import Any, Mapping

from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.helpers.translation import async_get_translations
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import slugify
import homeassistant.util.dt as dt_util

from .const import (
    CONF_COLLECTION_TIME,
    CONF_NAME,
    CONF_NOTIFY_ENABLED,
    CONF_NOTIFY_TIME,
    DEFAULT_COLLECTION_TIME,
    DEFAULT_NOTIFY_TIME,
    DOMAIN,
    EVENT_BINMASTER_NOTIFY,
    STORAGE_VERSION,
    SUBENTRY_TYPE_BIN,
)
from .localization import describe_recurrence as _describe_recurrence
from .localization import format_short_date, warm_locale
from .recurrence import compile_recurrence, next_occurrence

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class BinState:
    """Cached next-occurrence + check-in state for one bin-type subentry."""

    subentry_id: str
    next_date: date
    next_datetime: datetime  # tz-aware: next_date combined with collection_time
    config_hash: int
    checked_in: bool
    total_collections: int


def _config_hash(config: Mapping[str, Any]) -> int:
    """Cheap dirty-check hash for a subentry's data dict."""
    return hash(tuple(sorted((k, _hashable(v)) for k, v in config.items())))


def _hashable(value: Any) -> Any:
    return tuple(value) if isinstance(value, list) else value


def _bin_subentries(entry: ConfigEntry) -> dict[str, ConfigSubentry]:
    return {
        sid: se
        for sid, se in entry.subentries.items()
        if se.subentry_type == SUBENTRY_TYPE_BIN
    }


class BinMasterCoordinator(DataUpdateCoordinator[dict[str, BinState]]):
    """Push-driven coordinator: no polling, driven by scheduled callbacks."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, _LOGGER, name=DOMAIN, update_interval=None)
        self.entry = entry
        self._notify_unsubs: dict[str, CALLBACK_TYPE] = {}
        self._midnight_unsub: CALLBACK_TYPE | None = None
        self._store: Store[dict[str, dict[str, Any]]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}_{entry.entry_id}_checkin"
        )
        self._persisted_checkin: dict[str, dict[str, Any]] = {}
        self.pattern_labels: dict[str, str] = {}
        self.nth_labels: dict[str, str] = {}

    async def _async_update_data(self) -> dict[str, BinState]:
        """Full recompute of every current bin-type subentry.

        A single bin type with a bad/unparseable config must not take the
        whole integration down (it previously did, via
        async_config_entry_first_refresh -> ConfigEntryNotReady) — that bin
        is skipped with a logged error instead, the rest still load.
        """
        result: dict[str, BinState] = {}
        for subentry_id, subentry in _bin_subentries(self.entry).items():
            try:
                result[subentry_id] = self._compute_one(
                    subentry_id, subentry.data, self.data.get(subentry_id) if self.data else None
                )
            except Exception:  # noqa: BLE001 - isolate one bad bin from the rest
                _LOGGER.exception(
                    "Skipping bin type %s (subentry %s): could not compute next occurrence",
                    subentry.data.get(CONF_NAME, subentry_id),
                    subentry_id,
                )
        return result

    def _compute_one(
        self, subentry_id: str, config: Mapping[str, Any], previous: BinState | None
    ) -> BinState:
        rule = compile_recurrence(config)
        after = dt_util.now().replace(tzinfo=None)
        occurrence = next_occurrence(rule, after)
        if occurrence is None:
            raise ValueError(f"Recurrence for subentry {subentry_id} produced no future date")
        collection_time = dt_util.parse_time(
            config.get(CONF_COLLECTION_TIME, DEFAULT_COLLECTION_TIME)
        )
        next_dt = dt_util.as_local(datetime.combine(occurrence.date(), collection_time))
        if previous is not None:
            checked_in, total = previous.checked_in, previous.total_collections
        else:
            persisted = self._persisted_checkin.get(subentry_id, {})
            checked_in = bool(persisted.get("checked_in", False))
            total = int(persisted.get("total_collections", 0))
        return BinState(
            subentry_id=subentry_id,
            next_date=occurrence.date(),
            next_datetime=next_dt,
            config_hash=_config_hash(config),
            checked_in=checked_in,
            total_collections=total,
        )

    async def async_setup(self) -> None:
        """Initial load + register the midnight tick and per-bin notify trackers."""
        self._persisted_checkin = await self._store.async_load() or {}
        await self._async_load_labels()
        # Warm Babel's locale cache off the event loop, before any entity
        # (whose __init__/extra_state_attributes call format_short_date/
        # format_relative/describe_recurrence synchronously) gets created.
        await self.hass.async_add_executor_job(warm_locale, self.hass.config.language)
        await self.async_config_entry_first_refresh()
        self._midnight_unsub = async_track_time_change(
            self.hass, self._handle_midnight, hour=0, minute=0, second=1
        )
        for subentry_id, subentry in _bin_subentries(self.entry).items():
            self._resync_notify_tracker(subentry_id, subentry)

    async def _async_load_labels(self) -> None:
        """Preload pattern/nth display labels from strings.json/translations/*.json.

        One source of truth with the config flow's own selector options —
        a community translation PR to translations/xx.json covers both,
        no Python changes needed for a new language. Loaded once at setup
        (HA typically requires a restart for a language change to fully
        propagate anyway, so this doesn't need to be dynamic).
        """
        translations = await async_get_translations(
            self.hass, self.hass.config.language, "selector", integrations={DOMAIN}
        )
        prefix = f"component.{DOMAIN}.selector."
        self.pattern_labels = {
            key.removeprefix(f"{prefix}pattern.options."): value
            for key, value in translations.items()
            if key.startswith(f"{prefix}pattern.options.")
        }
        self.nth_labels = {
            key.removeprefix(f"{prefix}nth.options."): value
            for key, value in translations.items()
            if key.startswith(f"{prefix}nth.options.")
        }

    def describe_recurrence(self, config: Mapping[str, Any]) -> str:
        """Short human summary of a bin type's recurrence for the device model field."""
        return _describe_recurrence(
            config, self.hass.config.language, self.pattern_labels, self.nth_labels
        )

    @callback
    def async_teardown(self) -> None:
        """Cancel all scheduled callbacks."""
        if self._midnight_unsub is not None:
            self._midnight_unsub()
            self._midnight_unsub = None
        for unsub in self._notify_unsubs.values():
            unsub()
        self._notify_unsubs.clear()

    async def async_sync_subentries(self) -> None:
        """Recompute only the bin-type subentries whose config actually changed.

        Called from the config-entry update listener when the *set* of bin
        types is unchanged (add/remove goes through a full platform reload
        instead, since entities must be created/destroyed).
        """
        current = dict(self.data or {})
        changed = False
        bins = _bin_subentries(self.entry)
        for subentry_id, subentry in bins.items():
            new_hash = _config_hash(subentry.data)
            if subentry_id not in current or current[subentry_id].config_hash != new_hash:
                try:
                    current[subentry_id] = self._compute_one(
                        subentry_id, subentry.data, current.get(subentry_id)
                    )
                except Exception:  # noqa: BLE001 - isolate one bad bin from the rest
                    _LOGGER.exception(
                        "Skipping bin type %s (subentry %s): could not compute next occurrence",
                        subentry.data.get(CONF_NAME, subentry_id),
                        subentry_id,
                    )
                    current.pop(subentry_id, None)
                self._resync_notify_tracker(subentry_id, subentry)
                changed = True
        for stale_id in [sid for sid in current if sid not in bins]:
            del current[stale_id]
            self._resync_notify_tracker(stale_id, None)
            changed = True
        if changed:
            self.async_set_updated_data(current)

    async def _handle_midnight(self, now: datetime) -> None:
        """Recompute all next-occurrences, then reset checked_in for bins that rolled over."""
        previous = dict(self.data or {})
        await self.async_refresh()
        today = dt_util.now().date()
        updated: dict[str, BinState] = {}
        changed = False
        for subentry_id, state in (self.data or {}).items():
            prior = previous.get(subentry_id)
            if prior is not None and prior.next_date <= today and state.checked_in:
                updated[subentry_id] = replace(state, checked_in=False)
                changed = True
            else:
                updated[subentry_id] = state
        if changed:
            self.async_set_updated_data(updated)
            await self._async_save_checkin()

    async def async_check_in(self, subentry_id: str) -> None:
        """Mark a bin as collected: checked_in=True, total_collections += 1."""
        state = (self.data or {}).get(subentry_id)
        if state is None:
            return
        await self._async_apply_checkin(
            subentry_id, replace(state, checked_in=True, total_collections=state.total_collections + 1)
        )

    async def async_set_checked_in(self, subentry_id: str, value: bool) -> None:
        """Explicitly set checked_in (used by the check-in switch's on/off)."""
        state = (self.data or {}).get(subentry_id)
        if state is None or state.checked_in == value:
            return
        await self._async_apply_checkin(subentry_id, replace(state, checked_in=value))

    async def _async_apply_checkin(self, subentry_id: str, new_state: BinState) -> None:
        updated = dict(self.data or {})
        updated[subentry_id] = new_state
        self.async_set_updated_data(updated)
        await self._async_save_checkin()

    async def _async_save_checkin(self) -> None:
        await self._store.async_save(
            {
                sid: {"checked_in": s.checked_in, "total_collections": s.total_collections}
                for sid, s in (self.data or {}).items()
            }
        )

    def _resync_notify_tracker(
        self, subentry_id: str, subentry: ConfigSubentry | None
    ) -> None:
        if unsub := self._notify_unsubs.pop(subentry_id, None):
            unsub()
        if subentry is None or not subentry.data.get(CONF_NOTIFY_ENABLED):
            return
        notify_time = dt_util.parse_time(
            subentry.data.get(CONF_NOTIFY_TIME, DEFAULT_NOTIFY_TIME)
        )
        self._notify_unsubs[subentry_id] = async_track_time_change(
            self.hass,
            partial(self._handle_notify_check, subentry_id),
            hour=notify_time.hour,
            minute=notify_time.minute,
            second=0,
        )

    async def _handle_notify_check(self, subentry_id: str, now: datetime) -> None:
        state = (self.data or {}).get(subentry_id)
        subentry = self.entry.subentries.get(subentry_id)
        if state is None or subentry is None:
            return
        if state.next_date != dt_util.now().date() + timedelta(days=1):
            return
        name = subentry.data[CONF_NAME]
        language = self.hass.config.language
        message = f"{name} collection is tomorrow ({format_short_date(state.next_date, language)})"
        await self.hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "title": "BinMaster",
                "message": message,
                "notification_id": f"binmaster_{subentry_id}",
            },
        )
        self.hass.bus.async_fire(
            EVENT_BINMASTER_NOTIFY,
            {
                "entity_id": f"sensor.binmaster_{slugify(name)}",
                "friendly_name": name,
                "message": message,
            },
        )
