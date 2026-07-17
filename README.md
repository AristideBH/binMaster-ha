# BinMaster

A native Home Assistant integration for household waste-collection schedules — replaces manual YAML + local-iCal + Jinja/Mushroom-card dashboards with a UI-configured integration plus a companion Lovelace card.

## Install (HACS)

1. Add this repository to HACS as a custom repository (Integration).
2. Install "BinMaster", restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **BinMaster**.
4. On the BinMaster integration card, use **+ Add bin type** to add each waste type (e.g. "Ordures ménagères", "Recyclage", "Végétaux") — name, icon, color, collection time, recurrence pattern, and evening-before notifications.

Each bin type creates a `calendar.binmaster_*` entity (works with any standard HA calendar card/automation) and a `sensor.binmaster_*` entity (`state` = days until next collection; attributes: `color`, `icon`, `formatted_date`, `checked_in`, `total_collections`).

The `binmaster-card` Lovelace card is registered automatically — no manual resource step needed (unless your dashboard is in YAML mode, in which case add it manually; check the HA log for the exact resource URL).

```yaml
type: custom:binmaster-card
entity: sensor.binmaster_ordures_menageres
```

## Service

`binmaster.check_in` — call with a target of one or more `sensor.binmaster_*` entities to mark today's/tomorrow's collection as done. `checked_in` resets automatically at midnight.

## Event

`binmaster_notify` fires whenever a bin type's "notify evening before" setting triggers (in addition to a `persistent_notification`), with `entity_id`, `friendly_name`, and `message` — catch it in your own automation to route to mobile push, TTS, etc.

## Development

The card ships as a pre-built bundle (`custom_components/binmaster/frontend/binmaster-card.js`) so HACS installs don't need a build step. If you edit `frontend/src/binmaster-card.js`, rebuild it:

```sh
cd frontend
npm install
npm run build
```
