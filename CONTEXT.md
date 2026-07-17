# BinMaster

Home Assistant integration managing household waste-collection schedules and check-ins, replacing a manual YAML + iCal + Jinja/Mushroom-card dashboard.

## Language

**Bin type**:
One category of waste collected on its own schedule (e.g. "Ordures ménagères", "Recyclage", "Végétaux"). User-defined, unlimited per household.
_Avoid_: Waste type (used in the original brief, but "bin type" is the term used in code/UI — `bin_type` subentry type), category.

**Recurrence pattern**:
The rule describing how often and on which day(s) a bin type is collected. One of `weekly`, `biweekly`, `monthly` (Nth-weekday), or `custom`. Always compiles to exactly one `dateutil.rrule.rrule`.
_Avoid_: Schedule (too broad — schedule also implies collection time, which is a separate field).

**Collection time**:
The time of day a bin type is collected (HH:MM). Combined with the recurrence pattern's next date to produce the calendar event's start time.

**Check-in**:
The user action (via the `binmaster.check_in` service, or the card's checkmark button) marking that a specific collection has been dealt with. Flips `checked_in` to true and increments `total_collections`. Resets automatically at midnight after the collection date passes.
_Avoid_: Confirm, complete, mark done.

**Anchor date**:
The reference start date a recurrence pattern is computed from (`dtstart` for the underlying rrule). For `biweekly`, it's what determines which week is "on".

## Example dialogue

> **Dev**: When the user adds a new bin type, what actually gets stored?
> **Domain expert**: A bin type isn't its own config entry — it's a subentry under the single "BinMaster" entry. Its data is the name, icon, color, collection time, recurrence pattern fields, and notification settings.
> **Dev**: And "checked in" — is that part of the bin type's stored config?
> **Domain expert**: No. Check-in state (`checked_in`, `total_collections`) is runtime state, restored via `RestoreEntity`, not part of the bin type's persisted config. It's tied to the sensor, not the recurrence definition.
> **Dev**: So if I edit a bin type's recurrence pattern, does check-in status change?
> **Domain expert**: No — editing a bin type only touches its config; check-in state is independent and only resets on the midnight rollover.
