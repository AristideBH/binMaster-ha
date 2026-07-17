"""Sensor platform for BinMaster — days-until-collection sensor per bin type."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_platform
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import slugify
import homeassistant.util.dt as dt_util

from .attributes import bin_attributes
from .const import CONF_NAME, DOMAIN, SERVICE_CHECK_IN, SUBENTRY_TYPE_BIN
from .coordinator import BinMasterCoordinator


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up one BinMasterSensor per bin-type subentry, and the check_in service."""
    coordinator: BinMasterCoordinator = hass.data[DOMAIN][entry.entry_id]
    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_TYPE_BIN:
            continue
        async_add_entities(
            [BinMasterSensor(coordinator, subentry)],
            config_subentry_id=subentry.subentry_id,
        )

    platform = entity_platform.async_get_current_platform()
    platform.async_register_entity_service(SERVICE_CHECK_IN, {}, "async_check_in")


class BinMasterSensor(CoordinatorEntity[BinMasterCoordinator], SensorEntity):
    """Days-until-collection sensor for one bin type.

    checked_in/total_collections are NOT owned here — they live in the
    coordinator (shared with the check-in switch entity) so the two can
    never desync. See docs/adr/0004-coordinator-owned-checkin-state.md.
    """

    _attr_has_entity_name = True
    _attr_name = None
    _attr_native_unit_of_measurement = "d"

    def __init__(self, coordinator: BinMasterCoordinator, subentry: ConfigSubentry) -> None:
        """Initialize, linking to the subentry's device."""
        super().__init__(coordinator, context=subentry.subentry_id)
        self._subentry_id = subentry.subentry_id
        self._attr_unique_id = f"{subentry.subentry_id}_sensor"
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
    def _state(self):
        return self.coordinator.data.get(self._subentry_id) if self.coordinator.data else None

    @property
    def native_value(self) -> int | None:
        """Days until next collection: 0 = today, 1 = tomorrow, N = days away."""
        state = self._state
        if state is None:
            return None
        return (state.next_date - dt_util.now().date()).days

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """color/icon/formatted_date/relative/checked_in/total_collections."""
        return bin_attributes(
            self.coordinator, self._subentry_id, self._live_config, self.hass.config.language
        )

    async def async_check_in(self) -> None:
        """Target of the binmaster.check_in entity service."""
        await self.coordinator.async_check_in(self._subentry_id)
