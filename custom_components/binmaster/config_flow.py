"""Config flow for BinMaster.

BinMasterConfigFlow creates the single "BinMaster" entry (no fields).
BinTypeSubentryFlow is the add/edit wizard for one bin type, run as a
ConfigSubentryFlow (subentry_type="bin_type") so multiple bin types live
under that one entry, each with its own device.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    SOURCE_RECONFIGURE,
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryFlow,
    SubentryFlowResult,
)
from homeassistant.core import callback
from homeassistant.helpers import selector
import homeassistant.util.dt as dt_util

from .const import (
    CONF_ANCHOR_DATE,
    CONF_COLLECTION_TIME,
    CONF_COLOR,
    CONF_ICON,
    CONF_INTERVAL,
    CONF_NAME,
    CONF_NOTIFY_ENABLED,
    CONF_NOTIFY_TIME,
    CONF_NTH,
    CONF_PATTERN,
    CONF_RAW_RRULE,
    CONF_WEEKDAYS,
    DEFAULT_COLLECTION_TIME,
    DEFAULT_COLOR,
    DEFAULT_ICON,
    DEFAULT_INTERVAL,
    DEFAULT_NOTIFY_TIME,
    DOMAIN,
    NTH_OPTIONS,
    PATTERN_BIWEEKLY,
    PATTERN_CUSTOM,
    PATTERN_MONTHLY,
    PATTERN_WEEKLY,
    PATTERNS,
    SUBENTRY_TYPE_BIN,
    WEEKDAY_OPTIONS,
)
from .recurrence import RecurrenceError, compile_recurrence


def _today_iso() -> str:
    """Default for anchor-date fields, evaluated lazily on each form render.

    Without a bound default, HA's DateSelector widget shows today as a
    display-only placeholder but the field stays visually "empty" — some
    frontend/locale combinations then fail their own client-side date
    validation ("Could not parse date") on submit if the user never
    explicitly clicks a date. Binding a real default avoids that state.
    """
    return dt_util.now().date().isoformat()


# Step 1 ("user"): identity + when-collected time + which recurrence pattern.
# Step 2 (one of weekly/biweekly/monthly/custom): that pattern's fields + notify
# settings, combined — two steps total instead of the four this used to be,
# since HA config flow forms can't reactively change based on another field
# in the same form (each step is one static render).
STEP_BASIC_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_NAME): selector.TextSelector(),
        vol.Optional(CONF_ICON, default=DEFAULT_ICON): selector.IconSelector(),
        vol.Optional(CONF_COLOR, default=DEFAULT_COLOR): selector.TextSelector(),
        vol.Required(
            CONF_COLLECTION_TIME, default=DEFAULT_COLLECTION_TIME
        ): selector.TimeSelector(),
        vol.Required(CONF_PATTERN, default=PATTERN_WEEKLY): selector.SelectSelector(
            selector.SelectSelectorConfig(options=PATTERNS, translation_key="pattern")
        ),
    }
)

_WEEKDAY_SELECTOR_MULTI = selector.SelectSelector(
    selector.SelectSelectorConfig(
        options=WEEKDAY_OPTIONS, multiple=True, translation_key="weekday"
    )
)

_NOTIFY_FIELDS = {
    vol.Required(CONF_NOTIFY_ENABLED, default=False): selector.BooleanSelector(),
    vol.Optional(CONF_NOTIFY_TIME, default=DEFAULT_NOTIFY_TIME): selector.TimeSelector(),
}

WEEKLY_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_WEEKDAYS): _WEEKDAY_SELECTOR_MULTI,
        vol.Required(CONF_ANCHOR_DATE, default=_today_iso): selector.DateSelector(),
        **_NOTIFY_FIELDS,
    }
)

MONTHLY_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_WEEKDAYS): selector.SelectSelector(
            selector.SelectSelectorConfig(options=WEEKDAY_OPTIONS, translation_key="weekday")
        ),
        vol.Required(CONF_NTH): selector.SelectSelector(
            selector.SelectSelectorConfig(options=NTH_OPTIONS, translation_key="nth")
        ),
        vol.Required(CONF_ANCHOR_DATE, default=_today_iso): selector.DateSelector(),
        **_NOTIFY_FIELDS,
    }
)

CUSTOM_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_WEEKDAYS): _WEEKDAY_SELECTOR_MULTI,
        vol.Required(CONF_INTERVAL, default=DEFAULT_INTERVAL): selector.NumberSelector(
            selector.NumberSelectorConfig(min=1, max=52, step=1, mode="box")
        ),
        vol.Required(CONF_ANCHOR_DATE, default=_today_iso): selector.DateSelector(),
        vol.Optional(CONF_RAW_RRULE): selector.TextSelector(),
        **_NOTIFY_FIELDS,
    }
)

_PATTERN_SCHEMAS = {
    PATTERN_WEEKLY: WEEKLY_SCHEMA,
    PATTERN_BIWEEKLY: WEEKLY_SCHEMA,
    PATTERN_MONTHLY: MONTHLY_SCHEMA,
    PATTERN_CUSTOM: CUSTOM_SCHEMA,
}


class BinMasterConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle creation of the single BinMaster entry."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Single confirmation step; only one BinMaster entry is ever allowed."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title="BinMaster", data={})
        return self.async_show_form(step_id="user")

    @classmethod
    @callback
    def async_get_supported_subentry_types(
        cls, config_entry: ConfigEntry
    ) -> dict[str, type[ConfigSubentryFlow]]:
        """Bin types are managed as subentries of the single BinMaster entry."""
        return {SUBENTRY_TYPE_BIN: BinTypeSubentryFlow}


class BinTypeSubentryFlow(ConfigSubentryFlow):
    """Add/edit wizard for one bin type.

    Shared steps handle both creation (source=SOURCE_USER) and editing
    (source=SOURCE_RECONFIGURE) of an existing subentry.
    """

    def __init__(self) -> None:
        """Initialize with an empty working draft."""
        self._data: dict[str, Any] = {}

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Entry point for 'Add bin type' (also reused by reconfigure).

        Identity + collection time + which recurrence pattern. Submitting
        jumps straight to that pattern's own step (weekly/biweekly/monthly/
        custom), which also carries the notify fields — two steps total.
        """
        if user_input is not None:
            self._data.update(user_input)
            return await getattr(self, f"async_step_{user_input[CONF_PATTERN]}")()
        defaults = self._data or {
            CONF_ICON: DEFAULT_ICON,
            CONF_COLOR: DEFAULT_COLOR,
            CONF_COLLECTION_TIME: DEFAULT_COLLECTION_TIME,
            CONF_PATTERN: PATTERN_WEEKLY,
        }
        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(STEP_BASIC_SCHEMA, defaults),
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Entry point for editing an existing bin type."""
        if not self._data:
            self._data = dict(self._get_reconfigure_subentry().data)
        return await self.async_step_user(user_input)

    async def _async_step_pattern_fields(
        self, pattern: str, user_input: dict[str, Any] | None
    ) -> SubentryFlowResult:
        """That pattern's fields + notify settings; validates and persists on submit."""
        schema = _PATTERN_SCHEMAS[pattern]
        if user_input is not None:
            self._data.update(user_input)
            try:
                compile_recurrence(self._data)
            except RecurrenceError:
                return self.async_show_form(
                    step_id=pattern,
                    data_schema=self.add_suggested_values_to_schema(schema, self._data),
                    errors={"base": "invalid_recurrence"},
                )
            if self.source == SOURCE_RECONFIGURE:
                return self.async_update_and_abort(
                    self._get_entry(),
                    self._get_reconfigure_subentry(),
                    title=self._data[CONF_NAME],
                    data=self._data,
                )
            return self.async_create_entry(title=self._data[CONF_NAME], data=self._data)
        return self.async_show_form(
            step_id=pattern,
            data_schema=self.add_suggested_values_to_schema(schema, self._data),
        )

    async def async_step_weekly(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Weekly pattern fields: weekdays + anchor date."""
        return await self._async_step_pattern_fields(PATTERN_WEEKLY, user_input)

    async def async_step_biweekly(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Biweekly pattern fields: same shape as weekly, interval=2 baked into recurrence.py."""
        return await self._async_step_pattern_fields(PATTERN_BIWEEKLY, user_input)

    async def async_step_monthly(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Monthly pattern fields: single weekday + Nth occurrence + anchor date."""
        return await self._async_step_pattern_fields(PATTERN_MONTHLY, user_input)

    async def async_step_custom(
        self, user_input: dict[str, Any] | None = None
    ) -> SubentryFlowResult:
        """Custom pattern fields: weekdays + interval + anchor date, optional raw RRULE."""
        return await self._async_step_pattern_fields(PATTERN_CUSTOM, user_input)
