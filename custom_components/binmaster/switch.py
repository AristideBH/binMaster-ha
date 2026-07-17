"""Switch platform for BinMaster — a check-in toggle per bin type.

Exists so the check-in action can be surfaced as a native Tile card
"toggle" feature, since Tile card features are domain-bound and a plain
`sensor` doesn't get one. `is_on` mirrors the coordinator's shared
checked_in state (see coordinator.py / docs/adr/0004-*).

Turning on behaves like the binmaster.check_in service (increments
total_collections). Turning off just clears checked_in without
decrementing — so toggling off-then-on again for the same physical
collection will double-count total_collections. Accepted trade-off:
total_collections is a nice-to-have lifetime counter, not billing-critical,
and a manual off/on is expected to be rare.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import slugify

from .attributes import bin_attributes
from .const import CONF_ICON, CONF_NAME, DEFAULT_ICON, DOMAIN, SUBENTRY_TYPE_BIN
from .coordinator import BinMasterCoordinator


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up one check-in switch per bin-type subentry."""
    coordinator: BinMasterCoordinator = hass.data[DOMAIN][entry.entry_id]
    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_TYPE_BIN:
            continue
        async_add_entities(
            [BinMasterCheckInSwitch(coordinator, subentry)],
            config_subentry_id=subentry.subentry_id,
        )


class BinMasterCheckInSwitch(CoordinatorEntity[BinMasterCoordinator], SwitchEntity):
    """Toggle mirroring/controlling a bin type's checked_in state."""

    _attr_has_entity_name = True
    _attr_translation_key = "checked_in"

    def __init__(self, coordinator: BinMasterCoordinator, subentry: ConfigSubentry) -> None:
        """Initialize, linking to the subentry's device (same device as calendar+sensor)."""
        super().__init__(coordinator, context=subentry.subentry_id)
        self._subentry_id = subentry.subentry_id
        self._attr_unique_id = f"{subentry.subentry_id}_checked_in"
        self._attr_suggested_object_id = f"binmaster_{slugify(subentry.data[CONF_NAME])}_checked_in"
        self._attr_icon = subentry.data.get(CONF_ICON, DEFAULT_ICON)
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
    def is_on(self) -> bool:
        """Whether this bin type's next collection has been checked in."""
        state = self.coordinator.data.get(self._subentry_id) if self.coordinator.data else None
        return bool(state and state.checked_in)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Mirror the sensor's color/icon/formatted_date/relative/... attributes.

        Lets a Tile card pointed at this switch (for the toggle feature) still
        use them as state_content, e.g. `state_content: [relative, formatted_date]`.
        """
        return bin_attributes(
            self.coordinator, self._subentry_id, self._live_config, self.hass.config.language
        )

    async def async_turn_on(self, **kwargs) -> None:
        """Check in: same as the binmaster.check_in service (increments the counter)."""
        await self.coordinator.async_check_in(self._subentry_id)

    async def async_turn_off(self, **kwargs) -> None:
        """Clear checked_in without touching total_collections."""
        await self.coordinator.async_set_checked_in(self._subentry_id, False)
