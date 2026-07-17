# BinMaster

A native Home Assistant integration for household waste-collection schedules — replaces manual YAML + local-iCal + Jinja/Mushroom-card dashboards with a UI-configured integration plus a companion Lovelace card.

## Install (HACS)

1. Add this repository to HACS as a custom repository (Integration).
2. Install "BinMaster", restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **BinMaster**.
4. On the BinMaster integration card, use **+ Add bin type** to add each waste type (e.g. "Ordures ménagères", "Recyclage", "Végétaux") — name, icon, color, collection time, recurrence pattern, and evening-before notifications.

Each bin type creates a `calendar.binmaster_*` entity (works with any standard HA calendar card/automation) and a `sensor.binmaster_*` entity (`state` = days until next collection; attributes: `color`, `icon`, `formatted_date`, `checked_in`, `total_collections`).

The `binmaster-card` and `binmaster-overview-card` Lovelace cards are registered automatically — no manual resource step needed (unless your dashboard is in YAML mode, in which case add it manually; check the HA log for the exact resource URL). Both have a visual editor (click **Edit** on the card in the dashboard UI) — YAML below is for reference/YAML-mode dashboards.

```yaml
type: custom:binmaster-card
entity: sensor.binmaster_ordures_menageres
```

Point it at the `sensor.binmaster_*` entity; the card finds the matching `switch.binmaster_*_checked_in` on the same device automatically for the check-in button — clicking it toggles the switch (so you can un-check a mistaken check-in too, not just check in).

### binmaster-overview-card

Shows every bin type at once — auto-discovers all `sensor.binmaster_*` entities, sorted soonest-first with already-checked-in bins sunk to the bottom, so it always surfaces what still needs attention. No entity list to maintain; add a bin type in the integration and it just appears.

```yaml
type: custom:binmaster-overview-card
title: Waste collection # optional
layout: grid # "list" (default) or "grid"
columns: 2 # grid mode only
exclude: # optional, hide specific bins from this card
  - sensor.binmaster_vegetaux
```

### Alternative: mushroom-template-card

If you have [Mushroom](https://github.com/piitaya/lovelace-mushroom) installed, its template card can reproduce the same look with every field as a plain template, fully yours to restyle:

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
  action: navigate
  navigation_path: /lovelace-binmaster/ordures-menageres
```

`hold_action` navigates to a dedicated dashboard view showing a week/month calendar grid scoped to just this bin type (see below) — a long-press shows every future collection date, not just the next one. (An earlier version of this doc suggested `action: more-info` on the calendar entity for this; that doesn't actually work — calendar entities have no dedicated more-info view in HA, it just falls back to a generic state display. A real per-bin-type calendar view is the only way to get this.)

**Setting up the per-bin-type calendar view** (once per bin type): create a new dashboard view (Edit Dashboard → ⋮ → Add view, or a new tab), containing:

```yaml
type: calendar
entities:
  - calendar.binmaster_ordures_menageres
```

Then set `navigation_path` above to that view's path. Since HA's `/calendar` panel has no way to filter to one entity via a link, this per-bin-type view is the only route to a scoped week/month grid — a bit of manual setup per bin type, but it's stock Lovelace, nothing custom needed.

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
