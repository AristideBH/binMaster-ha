# Changelog

All notable changes to BinMaster are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions match `manifest.json` and the corresponding GitHub release tag.

## [Unreleased]

## [0.1.7] - 2026-07-17

### Added
- Visual editor for `binmaster-card` (entity picker, restricted to `sensor.binmaster_*`) — no more hand-writing YAML for the one config key.
- New `binmaster-overview-card`: auto-discovers all `sensor.binmaster_*` entities, sorted soonest-first with checked-in bins sunk to the bottom. `layout: list | grid` (with a `columns` option for grid), `exclude:` to hide specific bins, `title:` — with its own visual editor.
- `frontend/src/binmaster-shared.js`: row rendering (icon/badge/text/check-in button) factored out of `binmaster-card.js` into a shared module both cards now use, so they can't visually drift apart.

### Changed
- `binmaster-card`'s check-in button now toggles the `switch.binmaster_*_checked_in` entity (found automatically via shared-device lookup) instead of one-way calling the `binmaster.check_in` service — you can un-check a mistaken check-in from the card now, not just check in. Matches the interaction model already documented for the mushroom-template-card recipe.
- Both cards bundle into the same `binmaster-card.js` dist file as before (via a new `frontend/src/main.js` entry point) — no manifest/backend changes, no new Lovelace resource to register.

## [0.1.6] - 2026-07-17

### Fixed
- `RuntimeError: calls hass.async_create_task from a thread other than the event loop`, crashing `_async_register_frontend` on startup — `__init__.py`'s `EVENT_HOMEASSISTANT_STARTED` listener wrapped `hass.async_create_task` in a plain lambda, which isn't guaranteed to run on the event-loop thread. Fixed by passing an async function directly to `async_listen_once`, letting HA's event bus handle thread-safe scheduling itself.
- Blocking-call warning (`Detected blocking call to open ... babel/...`) — Babel lazily reads its CLDR data files from disk on first use per locale, and that first read was happening synchronously inside entity `__init__` (via `describe_recurrence`), directly in the event loop. Added `localization.warm_locale()`, called once via an executor job in `coordinator.async_setup()` before any entity is created, so Babel's cache is already warm by the time anything calls it synchronously.

Found via real HA core logs from a live instance — both were genuine bugs undetected by hassfest/HACS validation or the standalone logic tests used during development.

## [0.1.5] - 2026-07-17

### Fixed
- README's `mushroom-template-card` example: the `hold_action: more-info` suggestion for viewing a bin type's upcoming collections was wrong — traced it through the frontend source and confirmed calendar entities have no dedicated more-info view, it just shows a generic state display. Replaced with a `navigate` action to a dedicated per-bin-type calendar view, with setup instructions (HA's `/calendar` panel has no way to deep-link to one filtered entity, so a real view is the only route to a scoped week/month grid).

### Verified, no code change
- Confirmed `notify_enabled`/`notify_time` translations are correctly present in both `strings.json` and `translations/fr.json` for all four pattern steps. A report of them showing untranslated after updating to 0.1.3 is most likely a stale HA translation cache (reloading the config entry doesn't necessarily rebuild it) — a full HA restart should resolve it.

## [0.1.4] - 2026-07-17

### Added
- `.github/workflows/release.yml`: automatically tags and creates a GitHub Release once `Validate` passes on `main`, if `manifest.json`'s version doesn't already have a matching tag — release notes pulled from the matching `CHANGELOG.md` section. No more manual `git tag`/`gh release create` per version.
  - First run failed with `fatal: empty ident name` — `git tag -a` (annotated tag) needs a committer identity, which Actions runners don't set by default. Fixed with an explicit `git config user.name`/`user.email` before tagging.

### Changed
- `actions/checkout` and `actions/setup-node` bumped `v4` → `v7` in `validate.yml` to clear the "Node.js 20 is deprecated" warnings (both now target Node 24 natively).

## [0.1.3] - 2026-07-17

### Changed
- Config-flow bin-type wizard collapsed from 4 steps to 2: step 1 is now name/icon/color/collection-time/pattern-choice together, step 2 is the chosen pattern's fields + notify settings together. HA config flow can't reactively change a form's fields based on another field in that same form, so 2 is the practical minimum.
- Color field reverted from `ColorRGBSelector` back to a plain hex/CSS-name text field — the native RGB selector renders as a bare `<input type="color">` (an ugly full-width solid-color block, not the "hex label + preview swatch" combo it might suggest); the text field is more compact and honestly closer to what was wanted.
- README: added a "Setting up push notifications via automations" section with working examples, and a `mushroom-template-card` alternative to the custom card, including a `hold_action` that opens the bin type's calendar more-info dialog (a full upcoming-collections list) on long-press.

### Investigated, not changed
- Hiding the seconds field on the collection-time/notify-time pickers isn't possible — traced the `no_second` config option some frontend code references back to its source and confirmed it isn't actually exposed to `selector.TimeSelector()` for custom integrations; that's internal-only to HA's own settings pages.
- HA's named-color-swatch list picker (used in e.g. the Labels editor) isn't available to custom integrations either — its selector type isn't registered in the Python `selector.py` module, only used internally.

## [0.1.2] - 2026-07-17

### Fixed
- `async_remove_entry()` added to `__init__.py`: deletes the coordinator's own check-in `Store` (`.storage/binmaster_<entry_id>_checkin`) when the integration is removed. Previously this file was never cleaned up — HA's built-in entry-removal only handles entities/devices/config data, not storage private to the integration's own code.

## [0.1.1] - 2026-07-17

### Added
- Blank placeholder brand icons (`custom_components/binmaster/brand/icon.png`, `icon@2x.png`, `dark_icon.png`, `dark_icon@2x.png`) satisfying HACS's brands validation check and the [brands proxy API](https://developers.home-assistant.io/blog/2026/02/24/brands-proxy-api/) file structure — transparent placeholders, real artwork still pending.

## [0.1.0] - 2026-07-17

### Added
- Initial integration: single "BinMaster" config entry, bin types managed as config-entry subentries (add/edit/delete via the UI), each getting its own `calendar.binmaster_*` and `sensor.binmaster_*` entity pair.
- Recurrence engine (`dateutil.rrule`) supporting weekly, biweekly, monthly (Nth-weekday), and custom (interval or raw RRULE) patterns.
- `binmaster.check_in` service and `switch.binmaster_*_checked_in` entity for marking a collection done; auto-resets at midnight.
- Evening-before notifications (`persistent_notification` + `binmaster_notify` event), opt-in per bin type.
- Custom `binmaster-card` Lovelace card (auto-registered as a dashboard resource), esbuild-bundled.
- Open-ended i18n: `custom-card-helpers`/`Intl.RelativeTimeFormat` on the card, `Babel` on the backend, config-flow labels reused for the device's summary text — not limited to hand-translated languages.
- French translation (`translations/fr.json`).
- `async_migrate_entry` scaffold (no migrations needed yet — in place before the first breaking config-shape change, not after).
- CI: `hassfest`, `hacs/action`, and a check that the committed card dist matches a fresh build.

### Fixed
- `CONFIG_SCHEMA = None` crashed every install (`'NoneType' object is not callable`) — replaced with `cv.config_entry_only_config_schema`.
- A single bin type with an unparseable recurrence config could take the whole integration down (`ConfigEntryNotReady`) — isolated per-bin-type now, logs and skips instead.
- Config-flow date field left at its untouched default could fail HA's own client-side date validation — bound a real default instead of leaving it unset.
- `selector.nth.options`' `"-1"` key failed hassfest validation (keys can't start with a hyphen) — renamed to `"last"`.
- `manifest.json` was missing `dependencies`/`after_dependencies` for `http`/`lovelace`, and its keys weren't alphabetically sorted — both required by hassfest.
