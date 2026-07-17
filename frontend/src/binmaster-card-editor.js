import { LitElement, html } from "lit";
import { fireEvent } from "custom-card-helpers";

class BinMasterCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }
    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this._config.entity ?? ""}
        .includeDomains=${["sensor"]}
        .entityFilter=${(stateObj) => stateObj.entity_id.startsWith("sensor.binmaster_")}
        label="Entity"
        allow-custom-entity
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>
    `;
  }

  _entityChanged(ev) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, entity: ev.detail.value },
    });
  }
}

customElements.define("binmaster-card-editor", BinMasterCardEditor);
