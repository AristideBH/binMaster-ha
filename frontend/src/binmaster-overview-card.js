import { LitElement, html, css } from "lit";
import { renderBinRow, rowStyles } from "./binmaster-shared";
import "./binmaster-overview-card-editor";

const DEFAULT_COLUMNS = 2;

class BinMasterOverviewCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = { layout: "list", columns: DEFAULT_COLUMNS, exclude: [], ...config };
  }

  getCardSize() {
    const count = this._entityIds().length || 1;
    if (this._config?.layout === "grid") {
      return Math.ceil(count / (this._config.columns || DEFAULT_COLUMNS)) * 2 + 1;
    }
    return count * 2 + 1;
  }

  static getStubConfig() {
    return { layout: "list", columns: DEFAULT_COLUMNS, exclude: [] };
  }

  static getConfigElement() {
    return document.createElement("binmaster-overview-card-editor");
  }

  /** All sensor.binmaster_* entities minus any excluded, sorted soonest-first
   * with already-checked-in bins sunk to the bottom regardless of date —
   * surfaces what still needs attention. */
  _entityIds() {
    if (!this.hass) return [];
    const exclude = new Set(this._config?.exclude ?? []);
    return Object.keys(this.hass.states)
      .filter((id) => id.startsWith("sensor.binmaster_") && !exclude.has(id))
      .sort((a, b) => this._sortKey(a) - this._sortKey(b));
  }

  _sortKey(entityId) {
    const stateObj = this.hass.states[entityId];
    const days = Number(stateObj?.state);
    const checkedIn = !!stateObj?.attributes?.checked_in;
    return (checkedIn ? 100000 : 0) + (Number.isFinite(days) ? days : 99999);
  }

  render() {
    if (!this._config) {
      return html``;
    }
    if (!this.hass) {
      return html`<ha-card><div class="bm-placeholder">Loading…</div></ha-card>`;
    }
    const entityIds = this._entityIds();
    if (!entityIds.length) {
      return html`<ha-card
        ><div class="bm-placeholder">No BinMaster entities found</div></ha-card
      >`;
    }
    const isGrid = this._config.layout === "grid";
    return html`
      <ha-card .header=${this._config.title}>
        <div
          class="${isGrid ? "bm-grid" : "bm-list"}"
          style=${isGrid ? `--bm-columns: ${this._config.columns || DEFAULT_COLUMNS}` : ""}
        >
          ${entityIds.map((id) => renderBinRow(this.hass, id))}
        </div>
      </ha-card>
    `;
  }

  static styles = [
    rowStyles,
    css`
      ha-card {
        padding: 8px 16px;
      }
      .bm-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bm-grid {
        display: grid;
        grid-template-columns: repeat(var(--bm-columns, 2), 1fr);
        gap: 12px;
      }
    `,
  ];
}

customElements.define("binmaster-overview-card", BinMasterOverviewCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "binmaster-overview-card",
  name: "BinMaster Overview Card",
  description: "Shows all (or selected) BinMaster bin types at once, list or grid layout.",
});
