# Changelog

All notable changes to BinMaster are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions match `manifest.json` and the corresponding GitHub release tag.

## [Unreleased]

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
