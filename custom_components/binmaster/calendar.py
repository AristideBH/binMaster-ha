"""Calendar platform for BinMaster — one calendar entity per bin type."""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import slugify
import homeassistant.util.dt as dt_util

from .const import CONF_COLLECTION_TIME, CONF_NAME, DEFAULT_COLLECTION_TIME, DOMAIN, SUBENTRY_TYPE_BIN
from .coordinator import BinMasterCoordinator
from .recurrence import compile_recurrence, occurrences_between


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up one BinMasterCalendar per bin-type subentry."""
    coordinator: BinMasterCoordinator = hass.data[DOMAIN][entry.entry_id]
    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_TYPE_BIN:
            continue
        async_add_entities(
            [BinMasterCalendar(coordinator, subentry)],
            config_subentry_id=subentry.subentry_id,
        )


class BinMasterCalendar(CoordinatorEntity[BinMasterCoordinator], CalendarEntity):
    """Native calendar entity for one bin type's collection schedule."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, coordinator: BinMasterCoordinator, subentry: ConfigSubentry) -> None:
        """Initialize, linking to the subentry's device."""
        super().__init__(coordinator, context=subentry.subentry_id)
        self._subentry_id = subentry.subentry_id
        self._attr_unique_id = f"{subentry.subentry_id}_calendar"
        self._attr_suggested_object_id = f"binmaster_{slugify(subentry.data[CONF_NAME])}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, subentry.subentry_id)},
            name=subentry.data[CONF_NAME],
            model=coordinator.describe_recurrence(subentry.data),
        )

    @property
    def _live_config(self) -> dict:
        subentry = self.coordinator.entry.subentries.get(self._subentry_id)
        return dict(subentry.data) if subentry else {}

    @property
    def event(self) -> CalendarEvent | None:
        """Return the next upcoming event from the coordinator's cache."""
        occurrence = self.coordinator.data.get(self._subentry_id) if self.coordinator.data else None
        if occurrence is None:
            return None
        return CalendarEvent(
            start=occurrence.next_datetime,
            end=occurrence.next_datetime + timedelta(hours=1),
            summary=self._live_config.get(CONF_NAME, ""),
        )

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Range queries (month view etc.) re-run the rrule directly.

        The coordinator only caches a single next-occurrence, so a real date
        range expansion is done here on demand rather than from the cache.
        """
        config = self._live_config
        if not config:
            return []
        rule = compile_recurrence(config)
        collection_time = dt_util.parse_time(
            config.get(CONF_COLLECTION_TIME, DEFAULT_COLLECTION_TIME)
        )
        naive_start = start_date.replace(tzinfo=None)
        naive_end = end_date.replace(tzinfo=None)
        events = []
        for occurrence in occurrences_between(rule, naive_start, naive_end):
            start = dt_util.as_local(datetime.combine(occurrence.date(), collection_time))
            events.append(
                CalendarEvent(
                    start=start,
                    end=start + timedelta(hours=1),
                    summary=config.get(CONF_NAME, ""),
                )
            )
        return events
