import { LitElement, html, css } from "lit";
import { relativeTime } from "custom-card-helpers";

/** Convert a hex color or CSS color name to an rgba() string at the given alpha. */
function colorToRgba(color, alpha) {
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

class BinMasterCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("You must define an entity");
    }
    this._config = config;
  }

  getCardSize() {
    return 2;
  }

  static getStubConfig(hass) {
    const entity = Object.keys(hass.states).find((id) => id.startsWith("sensor.binmaster_"));
    return { entity: entity ?? "" };
  }

  /** Relative label ("Today"/"Tomorrow"/"In 3 days"/"Après-demain"/...) via HA's own
   * Intl.RelativeTimeFormat-backed helper, so it matches whatever language HA is set
   * to — every language HA supports, not just the ones we happen to hand-translate. */
  _relativeLabel(days) {
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + days);
    return relativeTime(target, this.hass.locale);
  }

  _handleCheckIn(ev) {
    ev.stopPropagation();
    this.hass.callService("binmaster", "check_in", {
      entity_id: this._config.entity,
    });
  }

  render() {
    if (!this._config) {
      return html``;
    }
    if (!this.hass) {
      return html`<ha-card><div class="placeholder">Loading…</div></ha-card>`;
    }
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html`<ha-card
        ><div class="placeholder">Entity not found: ${this._config.entity}</div></ha-card
      >`;
    }

    const attrs = stateObj.attributes;
    const days = Number(stateObj.state);
    const hasDays = Number.isFinite(days);
    const color = attrs.color || "#757575";
    const icon = attrs.icon || "mdi:trash-can";
    const checkedIn = !!attrs.checked_in;
    const canCheckIn = hasDays && !checkedIn && (days === 0 || days === 1);

    return html`
      <ha-card>
        <div class="row">
          <div class="icon-container" style="background:${colorToRgba(color, 0.2)}">
            <ha-icon .icon=${icon} style="color:${color}"></ha-icon>
            ${checkedIn
              ? html`<div class="badge"><ha-icon icon="mdi:check-circle"></ha-icon></div>`
              : ""}
          </div>
          <div class="info">
            <div class="primary">${attrs.friendly_name ?? stateObj.entity_id}</div>
            <div class="secondary">
              ${hasDays
                ? html`${this._relativeLabel(days)} · ${attrs.formatted_date ?? ""}`
                : stateObj.state}
            </div>
          </div>
          ${canCheckIn
            ? html`
                <ha-icon-button
                  class="check-in"
                  label="Check in"
                  @click=${this._handleCheckIn}
                >
                  <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                </ha-icon-button>
              `
            : ""}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 8px 16px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .icon-container {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .badge {
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
    .badge ha-icon {
      --mdc-icon-size: 14px;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .primary {
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .secondary {
      font-size: 0.875em;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .check-in {
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    .placeholder {
      padding: 16px;
      color: var(--secondary-text-color);
    }
  `;
}

customElements.define("binmaster-card", BinMasterCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "binmaster-card",
  name: "BinMaster Card",
  description: "Tile-style card for a BinMaster bin-collection sensor.",
});
