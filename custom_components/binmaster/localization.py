"""Locale-aware date/time formatting for BinMaster.

Backed by Babel (CLDR data) rather than Python's system locale.setlocale —
same reliability rationale as the original hand-rolled map (HA is a single
process serving many users; global/thread-unsafe locale switching is a
non-starter), just backed by a maintained third-party CLDR dataset instead
of a map limited to whichever languages we happened to hand-translate.

format_relative()'s today/tomorrow/day-after-tomorrow labels are the one
exception: Babel's format_timedelta has no equivalent of JS
Intl.RelativeTimeFormat's "auto" idioms (it always says "in 0 days"
literally), so those three are a small hand-rolled override on top.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any, Mapping

from babel.core import UnknownLocaleError
from babel.dates import format_date, format_timedelta, get_day_names

_TODAY_TOMORROW: dict[str, tuple[str, str, str]] = {
    # (today, tomorrow, day_after_tomorrow) — extend as translations/xx.json grows.
    "en": ("Today", "Tomorrow", "Day after tomorrow"),
    "fr": ("Aujourd'hui", "Demain", "Après-demain"),
}

_WEEKDAY_INDEX = {"mon": 0, "tue": 1, "wed": 2, "thu": 3, "fri": 4, "sat": 5, "sun": 6}


def _babel_locale(language: str) -> str:
    """HA uses BCP-47-ish hyphenated codes (en-GB); Babel wants CLDR underscores."""
    return language.replace("-", "_")


def format_short_date(value: date, language: str) -> str:
    """Return a locale-aware short date, e.g. 'mer. 17/07' / 'Wed 17/07'."""
    try:
        return format_date(value, format="EEE dd/MM", locale=_babel_locale(language))
    except (ValueError, UnknownLocaleError):
        return format_date(value, format="EEE dd/MM", locale="en")


def format_relative(days: int, language: str) -> str:
    """Return a locale-aware relative label, e.g. 'Demain', 'in 5 days'."""
    override = _TODAY_TOMORROW.get(language)
    if override and 0 <= days <= 2:
        return override[days]
    try:
        locale = _babel_locale(language)
        return format_timedelta(
            timedelta(days=days), granularity="day", add_direction=True, locale=locale
        )
    except (ValueError, UnknownLocaleError):
        return format_timedelta(
            timedelta(days=days), granularity="day", add_direction=True, locale="en"
        )


def describe_recurrence(
    config: Mapping[str, Any],
    language: str,
    pattern_labels: Mapping[str, str],
    nth_labels: Mapping[str, str],
) -> str:
    """Short human summary of a bin type's recurrence, e.g. 'Weekly: Tue, Fri'.

    Used as the device's `model` field so the device list's secondary text
    (HA core only shows model/sw_version/manufacturer there) is actually
    useful instead of blank. pattern_labels/nth_labels come from the
    coordinator's preloaded translations (strings.json's own
    selector.pattern/nth.options — one source of truth, see
    coordinator.async_setup()), not a separate hardcoded map.
    """
    pattern = config.get("pattern")
    pattern_label = pattern_labels.get(pattern, pattern or "?")

    if pattern == "custom" and config.get("raw_rrule"):
        return f"{pattern_label} (RRULE)"

    try:
        locale = _babel_locale(language)
        weekdays_table = get_day_names("abbreviated", locale=locale)
    except (ValueError, UnknownLocaleError):
        weekdays_table = get_day_names("abbreviated", locale="en")

    weekdays = config.get("weekdays") or []
    days = ", ".join(
        weekdays_table[_WEEKDAY_INDEX[d]] for d in weekdays if d in _WEEKDAY_INDEX
    )

    if pattern == "monthly":
        nth = nth_labels.get(str(config.get("nth")), config.get("nth"))
        return f"{pattern_label}: {nth} {days}".strip()

    return f"{pattern_label}: {days}" if days else pattern_label
