"""Compile a BinMaster bin-type config into a dateutil.rrule.rrule.

All rrule math here is naive-datetime (dateutil.rrule does not mix well with
tz-aware datetimes). Callers are responsible for stripping tzinfo before
calling in, and for localizing/combining-with-collection-time the results.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Mapping

from dateutil import rrule
from dateutil.rrule import FR, MO, SA, SU, TH, TU, WE, weekday
from homeassistant.exceptions import HomeAssistantError

from .const import (
    CONF_ANCHOR_DATE,
    CONF_INTERVAL,
    CONF_NTH,
    CONF_PATTERN,
    CONF_RAW_RRULE,
    CONF_WEEKDAYS,
    DEFAULT_INTERVAL,
    PATTERN_BIWEEKLY,
    PATTERN_CUSTOM,
    PATTERN_MONTHLY,
    PATTERN_WEEKLY,
)

_WEEKDAY_CONST: dict[str, weekday] = {
    "mon": MO,
    "tue": TU,
    "wed": WE,
    "thu": TH,
    "fri": FR,
    "sat": SA,
    "sun": SU,
}


class RecurrenceError(HomeAssistantError):
    """Raised when a bin-type config can't be compiled into a valid rrule."""


def _naive_midnight(value: date | str) -> datetime:
    if isinstance(value, str):
        try:
            value = date.fromisoformat(value)
        except ValueError:
            # HA's DateSelector is documented to submit ISO (YYYY-MM-DD), but
            # some frontend/locale combinations have been seen round-tripping
            # a localized DD/MM/YYYY string instead. Accept it defensively
            # rather than crashing the whole coordinator refresh.
            try:
                value = datetime.strptime(value, "%d/%m/%Y").date()
            except ValueError as err:
                raise RecurrenceError(f"Could not parse date: {value!r}") from err
    return datetime(value.year, value.month, value.day)


def _weekdays(selected: list[str]) -> list[weekday]:
    try:
        return [_WEEKDAY_CONST[day] for day in selected]
    except KeyError as err:
        raise RecurrenceError(f"Unknown weekday: {err}") from err


def compile_recurrence(config: Mapping[str, Any]) -> rrule.rrule:
    """Build one dateutil.rrule.rrule from a bin-type's stored config dict."""
    pattern = config.get(CONF_PATTERN)
    if pattern == PATTERN_CUSTOM and (raw := config.get(CONF_RAW_RRULE)):
        dtstart = _naive_midnight(config[CONF_ANCHOR_DATE])
        try:
            compiled = rrule.rrulestr(raw, dtstart=dtstart)
        except (ValueError, TypeError) as err:
            raise RecurrenceError(f"Invalid raw RRULE: {err}") from err
        if isinstance(compiled, rrule.rruleset):
            raise RecurrenceError("Raw RRULE must be a single rule, not a set")
        return compiled

    if CONF_ANCHOR_DATE not in config:
        raise RecurrenceError("Missing anchor_date")
    dtstart = _naive_midnight(config[CONF_ANCHOR_DATE])

    if pattern == PATTERN_WEEKLY:
        return rrule.rrule(
            rrule.WEEKLY, dtstart=dtstart, interval=1, byweekday=_weekdays(config[CONF_WEEKDAYS])
        )
    if pattern == PATTERN_BIWEEKLY:
        return rrule.rrule(
            rrule.WEEKLY, dtstart=dtstart, interval=2, byweekday=_weekdays(config[CONF_WEEKDAYS])
        )
    if pattern == PATTERN_MONTHLY:
        weekdays = config[CONF_WEEKDAYS]
        if not weekdays:
            raise RecurrenceError("Monthly pattern requires a weekday")
        wd_const = _WEEKDAY_CONST[weekdays[0]]
        raw_nth = config[CONF_NTH]
        nth = -1 if raw_nth == "last" else int(raw_nth)
        return rrule.rrule(rrule.MONTHLY, dtstart=dtstart, byweekday=wd_const(nth))
    if pattern == PATTERN_CUSTOM:
        return rrule.rrule(
            rrule.WEEKLY,
            dtstart=dtstart,
            interval=int(config.get(CONF_INTERVAL, DEFAULT_INTERVAL)),
            byweekday=_weekdays(config[CONF_WEEKDAYS]),
        )
    raise RecurrenceError(f"Unknown recurrence pattern: {pattern!r}")


def next_occurrence(rule: rrule.rrule, after: datetime) -> datetime | None:
    """Return the next occurrence at or after `after` (naive datetime)."""
    return rule.after(after, inc=True)


def occurrences_between(rule: rrule.rrule, start: datetime, end: datetime) -> list[datetime]:
    """Return all occurrences in [start, end] (naive datetimes)."""
    return list(rule.between(start, end, inc=True))
