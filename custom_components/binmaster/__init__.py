"""The BinMaster integration."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import EVENT_HOMEASSISTANT_STARTED, CoreState, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, FRONTEND_JS_FILENAME, FRONTEND_URL_BASE, PLATFORMS, SUBENTRY_TYPE_BIN
from .coordinator import BinMasterCoordinator

_LOGGER = logging.getLogger(__name__)

# UI-configured only, no YAML support. NOTE: must not be plain `None` — HA calls
# CONFIG_SCHEMA(config) whenever the attribute exists, and `None(...)` crashes
# with "'NoneType' object is not callable" (this broke every install until fixed).
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the BinMaster Lovelace card resource, hass-wide, once."""
    if hass.state is CoreState.running:
        await _async_register_frontend(hass)
    else:
        hass.bus.async_listen_once(
            EVENT_HOMEASSISTANT_STARTED, lambda _event: hass.async_create_task(
                _async_register_frontend(hass)
            )
        )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up BinMaster from a config entry."""
    coordinator = BinMasterCoordinator(hass, entry)
    await coordinator.async_setup()
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a BinMaster config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        coordinator: BinMasterCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        coordinator.async_teardown()
    return unload_ok


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Migrate an old config entry to the current version.

    No migration is needed yet — BinMasterConfigFlow.VERSION is still 1 and
    every released version so far has used the same ConfigSubentry.data
    shape. This is scaffolding: the moment a future release needs to change
    that shape, it has somewhere to put the migration instead of that
    change having to be retrofitted under pressure once real users already
    have the old shape stored (see docs/adr for the version this lands in).
    """
    if entry.version == 1:
        return True
    _LOGGER.error(
        "Cannot migrate BinMaster config entry from version %s.%s — no migration path defined",
        entry.version,
        entry.minor_version,
    )
    return False


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle a change to the entry or one of its bin-type subentries.

    If the *set* of bin-type subentries changed, platforms must create/destroy
    entities, so the whole entry is reloaded. If only a subentry's data
    changed, the coordinator does a targeted recompute instead.
    """
    coordinator: BinMasterCoordinator = hass.data[DOMAIN][entry.entry_id]
    current_ids = {
        sid for sid, se in entry.subentries.items() if se.subentry_type == SUBENTRY_TYPE_BIN
    }
    cached_ids = set(coordinator.data or {})
    if current_ids != cached_ids:
        await hass.config_entries.async_reload(entry.entry_id)
        return
    await coordinator.async_sync_subentries()


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the card's JS and auto-register it as a Lovelace resource.

    Idempotent: safe to call once per HA run. Registering the Lovelace
    resource only works when Lovelace is in storage mode (the default); in
    YAML mode we just log so the user can add it manually.
    """
    guard_key = f"{DOMAIN}_frontend_registered"
    if hass.data.get(guard_key):
        return
    hass.data[guard_key] = True

    js_path = Path(__file__).parent / "frontend" / FRONTEND_JS_FILENAME
    await hass.http.async_register_static_paths(
        [StaticPathConfig(f"{FRONTEND_URL_BASE}/{FRONTEND_JS_FILENAME}", str(js_path), False)]
    )

    version_tag = hashlib.sha1(js_path.read_bytes()).hexdigest()[:8]
    resource_url = f"{FRONTEND_URL_BASE}/{FRONTEND_JS_FILENAME}?v={version_tag}"

    lovelace_data = hass.data.get(LOVELACE_DATA)
    if lovelace_data is None:
        _LOGGER.debug("Lovelace not loaded yet; skipping automatic resource registration")
        return
    if lovelace_data.resource_mode != "storage":
        _LOGGER.warning(
            "Lovelace is in YAML mode; add %s as a JS module resource manually", resource_url
        )
        return

    existing = [
        item
        for item in lovelace_data.resources.async_items()
        if str(item.get("url", "")).startswith(FRONTEND_URL_BASE)
    ]
    if existing and existing[0]["url"] == resource_url:
        return
    for item in existing:
        await lovelace_data.resources.async_delete_item(item["id"])
    await lovelace_data.resources.async_create_item({"res_type": "module", "url": resource_url})
