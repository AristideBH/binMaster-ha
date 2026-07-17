"""Constants for the BinMaster integration."""

from homeassistant.const import Platform

DOMAIN = "binmaster"
PLATFORMS = [Platform.CALENDAR, Platform.SENSOR, Platform.SWITCH]
SUBENTRY_TYPE_BIN = "bin_type"
STORAGE_VERSION = 1

# ConfigSubentry.data keys
CONF_NAME = "name"
CONF_ICON = "icon"
CONF_COLOR = "color"
CONF_COLLECTION_TIME = "collection_time"  # "HH:MM"
CONF_NOTIFY_ENABLED = "notify_enabled"
CONF_NOTIFY_TIME = "notify_time"  # "HH:MM"
CONF_PATTERN = "pattern"  # "weekly" | "biweekly" | "monthly" | "custom"
CONF_WEEKDAYS = "weekdays"  # list["mon".."sun"]
CONF_ANCHOR_DATE = "anchor_date"  # "YYYY-MM-DD"
CONF_INTERVAL = "interval"  # custom pattern only, weeks
CONF_NTH = "nth"  # monthly only: "1".."4" | "-1" (last)
CONF_RAW_RRULE = "raw_rrule"  # custom pattern, optional advanced override

PATTERN_WEEKLY = "weekly"
PATTERN_BIWEEKLY = "biweekly"
PATTERN_MONTHLY = "monthly"
PATTERN_CUSTOM = "custom"
PATTERNS = [PATTERN_WEEKLY, PATTERN_BIWEEKLY, PATTERN_MONTHLY, PATTERN_CUSTOM]

DEFAULT_ICON = "mdi:trash-can"
DEFAULT_COLOR = "#757575"
DEFAULT_COLLECTION_TIME = "08:30"
DEFAULT_NOTIFY_TIME = "20:00"
DEFAULT_INTERVAL = 1

# sensor.binmaster_* attributes
ATTR_COLOR = "color"
ATTR_FORMATTED_DATE = "formatted_date"
ATTR_RELATIVE = "relative"
ATTR_CHECKED_IN = "checked_in"
ATTR_TOTAL_COLLECTIONS = "total_collections"

SERVICE_CHECK_IN = "check_in"
EVENT_BINMASTER_NOTIFY = "binmaster_notify"

# dateutil.rrule byweekday order: Monday=0 .. Sunday=6
WEEKDAY_OPTIONS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
NTH_OPTIONS = ["1", "2", "3", "4", "-1"]

FRONTEND_URL_BASE = "/binmaster_static"
FRONTEND_JS_FILENAME = "binmaster-card.js"
