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

### Alternative: mushroom-template-card

If you have [Mushroom](https://github.com/piitaya/lovelace-mushroom) installed, its template card can reproduce (and extend) the same look using the `switch.binmaster_*_checked_in` entity — gives you a real toggle (`tap_action: toggle`) instead of the custom card's one-way check-in button, and every field is a plain template so it's fully yours to restyle:

```yaml
type: custom:mushroom-template-card
entity: switch.binmaster_ordures_menageres_checked_in
primary: "{{ device_name(entity) }}"
secondary: >-
  {{ state_attr(entity, 'relative') }} · {{ state_attr(entity, 'formatted_date') }}
icon: "{{ state_attr(entity, 'icon') }}"
color: >-
  {% if is_state(entity, 'on') %}grey{% else %}{{ state_attr(entity, 'color') }}{% endif %}
badge_icon: "{% if is_state(entity, 'on') %}mdi:check-circle{% endif %}"
badge_color: green
tap_action:
  action: toggle
hold_action:
  action: more-info
  entity: calendar.binmaster_ordures_menageres
```

`hold_action` opens the bin type's `calendar.binmaster_*` more-info dialog — HA renders that as an upcoming-events list, so a long-press shows every future collection date for that bin type rather than just the next one.

## Service

`binmaster.check_in` — call with a target of one or more `sensor.binmaster_*` entities to mark today's/tomorrow's collection as done. `checked_in` resets automatically at midnight.

## Event

`binmaster_notify` fires whenever a bin type's "notify evening before" setting triggers (in addition to a `persistent_notification`), with `entity_id`, `friendly_name`, and `message` — catch it in your own automation to route to mobile push, TTS, etc.

## Setting up push notifications via automations

BinMaster deliberately doesn't send push notifications itself (no notify-service target to configure per bin type) — it fires `binmaster_notify` and lets you decide where it goes. A minimal automation forwarding it to a phone:

```yaml
alias: BinMaster reminder to phone
trigger:
  - platform: event
    event_type: binmaster_notify
action:
  - service: notify.mobile_app_your_phone
    data:
      title: "{{ trigger.event.data.friendly_name }}"
      message: "{{ trigger.event.data.message }}"
```

To notify multiple people, or route differently per bin type, filter on the event data:

```yaml
alias: BinMaster reminder, only for green waste
trigger:
  - platform: event
    event_type: binmaster_notify
    event_data:
      entity_id: sensor.binmaster_vegetaux
action:
  - service: notify.mobile_app_your_phone
    data:
      title: "{{ trigger.event.data.friendly_name }}"
      message: "{{ trigger.event.data.message }}"
```

Prefer a condition/template trigger over hardcoding the entity if you want the same automation to handle several specific bin types (`{{ trigger.event.data.entity_id in ['sensor.binmaster_a', 'sensor.binmaster_b'] }}`).

Remember: this only fires for bin types with "Notify the evening before" turned on in their config — most people won't want it for every bin type.

## Development

The card ships as a pre-built bundle (`custom_components/binmaster/frontend/binmaster-card.js`) so HACS installs don't need a build step. If you edit `frontend/src/binmaster-card.js`, rebuild it:

```sh
cd frontend
npm install
npm run build
```
