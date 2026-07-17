# Changelog

All notable changes to BinMaster are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions match `manifest.json` and the corresponding GitHub release tag.

## [Unreleased]

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
