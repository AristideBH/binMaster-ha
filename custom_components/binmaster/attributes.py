"""Shared bin-type display attributes, used by both the sensor and the check-in switch.

Both entities point a Tile card at themselves and expect the same
state_content options (color/icon/formatted_date/relative/...) to be
available — duplicating this computation per-platform would drift.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Mapping

import homeassistant.util.dt as dt_util

from .const import (
    ATTR_CHECKED_IN,
    ATTR_COLOR,
    ATTR_FORMATTED_DATE,
    ATTR_RELATIVE,
    ATTR_TOTAL_COLLECTIONS,
    CONF_COLOR,
    CONF_ICON,
    DEFAULT_COLOR,
    DEFAULT_ICON,
)
from .localization import format_relative, format_short_date

if TYPE_CHECKING:
    from .coordinator import BinMasterCoordinator


def bin_attributes(
    coordinator: "BinMasterCoordinator",
    subentry_id: str,
    config: Mapping[str, Any],
    language: str,
) -> dict[str, Any]:
    """color/icon/formatted_date/relative/checked_in/total_collections for one bin type."""
    state = coordinator.data.get(subentry_id) if coordinator.data else None
    days = (state.next_date - dt_util.now().date()).days if state else None
    return {
        ATTR_COLOR: config.get(CONF_COLOR, DEFAULT_COLOR),
        "icon": config.get(CONF_ICON, DEFAULT_ICON),
        ATTR_FORMATTED_DATE: format_short_date(state.next_date, language) if state else None,
        ATTR_RELATIVE: format_relative(days, language) if days is not None else None,
        ATTR_CHECKED_IN: state.checked_in if state else False,
        ATTR_TOTAL_COLLECTIONS: state.total_collections if state else 0,
    }
