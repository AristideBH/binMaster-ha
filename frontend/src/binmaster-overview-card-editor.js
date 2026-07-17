import { LitElement, html, css } from "lit";
import { fireEvent } from "custom-card-helpers";

class BinMasterOverviewCardEditor extends LitElement {
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
    const layout = this._config.layout ?? "list";
    return html`
      <ha-select
        label="Layout"
        .value=${layout}
        naturalMenuWidth
        @selected=${this._layoutChanged}
        @closed=${(ev) => ev.stopPropagation()}
      >
        <ha-list-item value="list">List</ha-list-item>
        <ha-list-item value="grid">Grid</ha-list-item>
      </ha-select>

      ${layout === "grid"
        ? html`
            <ha-input
              type="number"
              label="Columns"
              min="1"
              max="6"
              .value=${String(this._config.columns ?? 2)}
              @change=${this._columnsChanged}
            ></ha-input>
          `
        : ""}

      <ha-entities-picker
        .hass=${this.hass}
        .value=${this._config.exclude ?? []}
        .includeDomains=${["sensor"]}
        label="Exclude entities"
        @value-changed=${this._excludeChanged}
      ></ha-entities-picker>
    `;
  }

  _layoutChanged(ev) {
    const value = ev.detail.value;
    if (!value || value === this._config.layout) return;
    this._update({ layout: value });
  }

  _columnsChanged(ev) {
    this._update({ columns: Number(ev.target.value) || 2 });
  }

  _excludeChanged(ev) {
    this._update({ exclude: ev.detail.value });
  }

  _update(patch) {
    fireEvent(this, "config-changed", { config: { ...this._config, ...patch } });
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `;
}

customElements.define("binmaster-overview-card-editor", BinMasterOverviewCardEditor);
