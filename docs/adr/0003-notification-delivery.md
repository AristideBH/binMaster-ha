# Deliver "notify evening before" via persistent_notification + event, not a user-selected notify service

Each bin type can opt in to a reminder the evening before its next collection. Rather than adding a config-flow field asking the user to pick a specific `notify.*` target service (e.g. a mobile app), BinMaster fires `persistent_notification.create` (visible in HA's notification bell, zero setup) and fires a custom `binmaster_notify` event carrying `entity_id`/`friendly_name`/`message`.

This keeps the feature zero-config out of the box — no dependency on which notify integrations a given household has set up — while still letting power users catch the event in their own automation to route to mobile push, TTS, etc. The trade-off is that BinMaster itself never sends an actual push notification; if a future user wants that without writing an automation, a user-selectable notify-service option would need to be added as an opt-in on top of this.
