import { LitElement, html, css } from "lit";
import { renderBinRow, rowStyles } from "./binmaster-shared";
import "./binmaster-card-editor";

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

  static getConfigElement() {
    return document.createElement("binmaster-card-editor");
  }

  render() {
    if (!this._config) {
      return html``;
    }
    if (!this.hass) {
      return html`<ha-card><div class="bm-placeholder">Loading…</div></ha-card>`;
    }
    if (!this.hass.states[this._config.entity]) {
      return html`<ha-card
        ><div class="bm-placeholder">Entity not found: ${this._config.entity}</div></ha-card
      >`;
    }
    return html`<ha-card>${renderBinRow(this.hass, this._config.entity)}</ha-card>`;
  }

  static styles = [
    rowStyles,
    css`
      ha-card {
        padding: 8px 16px;
      }
    `,
  ];
}

customElements.define("binmaster-card", BinMasterCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "binmaster-card",
  name: "BinMaster Card",
  description: "Tile-style card for a BinMaster bin-collection sensor.",
});
