import { css, html } from "lit";
import { relativeTime } from "custom-card-helpers";

/** Convert a hex color or CSS color name to an rgba() string at the given alpha. */
export function colorToRgba(color, alpha) {
  const probe = document.createElement("div");
  probe.style.color = color;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const match = computed.match(/\d+(\.\d+)?/g);
  if (!match || match.length < 3) {
    return `rgba(117, 117, 117, ${alpha})`;
  }
  const [r, g, b] = match;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Find the switch.*_checked_in entity sharing a device with this sensor
 * entity (calendar/sensor/switch all register on the same device, one per
 * bin type subentry — see coordinator.py). Falls back to undefined if the
 * entity registry isn't available or no matching switch is found, so
 * callers can degrade to the sensor's own checked_in attribute.
 */
export function resolveSwitchEntity(hass, sensorEntityId) {
  const entities = hass.entities;
  if (!entities) return undefined;
  const sensorEntry = entities[sensorEntityId];
  if (!sensorEntry || !sensorEntry.device_id) return undefined;
  const match = Object.values(entities).find(
    (e) => e.device_id === sensorEntry.device_id && e.entity_id.startsWith("switch.")
  );
  return match?.entity_id;
}

/** Relative label ("Today"/"Tomorrow"/"In 3 days"/"Après-demain"/...) via HA's own
 * Intl.RelativeTimeFormat-backed helper — every language HA supports, not just
 * the ones hand-translated. */
export function relativeLabel(hass, days) {
  const target = new Date();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + days);
  return relativeTime(target, hass.locale);
}

/**
 * Renders one bin-type row: colored icon (badge overlay when checked in),
 * name + relative/date text, and a check-in toggle button. Shared between
 * binmaster-card (one row) and binmaster-overview-card (many rows), so the
 * two never visually drift apart.
 */
export function renderBinRow(hass, sensorEntityId) {
  const stateObj = hass.states[sensorEntityId];
  if (!stateObj) {
    return html`<div class="bm-row bm-placeholder">Entity not found: ${sensorEntityId}</div>`;
  }
  const attrs = stateObj.attributes;
  const days = Number(stateObj.state);
  const hasDays = Number.isFinite(days);
  const color = attrs.color || "#757575";
  const icon = attrs.icon || "mdi:trash-can";

  const switchEntityId = resolveSwitchEntity(hass, sensorEntityId);
  const switchState = switchEntityId ? hass.states[switchEntityId] : undefined;
  const checkedIn = switchState ? switchState.state === "on" : !!attrs.checked_in;
  const canToggle = hasDays && (days === 0 || days === 1) && !!switchEntityId;

  const handleToggle = (ev) => {
    ev.stopPropagation();
    hass.callService("switch", "toggle", { entity_id: switchEntityId });
  };

  return html`
    <div class="bm-row">
      <div class="bm-icon-container" style="background:${colorToRgba(color, 0.2)}">
        <ha-icon .icon=${icon} style="color:${color}"></ha-icon>
        ${checkedIn
          ? html`<div class="bm-badge"><ha-icon icon="mdi:check-circle"></ha-icon></div>`
          : ""}
      </div>
      <div class="bm-info">
        <div class="bm-primary">${attrs.friendly_name ?? stateObj.entity_id}</div>
        <div class="bm-secondary">
          ${hasDays
            ? html`${relativeLabel(hass, days)} · ${attrs.formatted_date ?? ""}`
            : stateObj.state}
        </div>
      </div>
      ${canToggle
        ? html`
            <ha-icon-button class="bm-check-in" label="Check in" @click=${handleToggle}>
              <ha-icon
                icon=${checkedIn ? "mdi:check-circle" : "mdi:check-circle-outline"}
              ></ha-icon>
            </ha-icon-button>
          `
        : ""}
    </div>
  `;
}

export const rowStyles = css`
  .bm-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bm-icon-container {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .bm-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--card-background-color, #fff);
    color: var(--success-color, #4caf50);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bm-badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .bm-info {
    flex: 1;
    min-width: 0;
  }
  .bm-primary {
    font-weight: 500;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bm-secondary {
    font-size: 0.875em;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bm-check-in {
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .bm-placeholder {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;
