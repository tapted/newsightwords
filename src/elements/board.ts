import './word';

import {LitElement, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {html} from 'lit-html';

const LIST1 = ['at', 'I', 'am', 'a', 'the'];
const LIST2 = ['look', 'in', 'my', 'can', 'do'];
export const WORDS = new Map<string, string[]>([
  ['List 1', LIST1],
  ['List 2', LIST2],
]);

@customElement('e-board')
export class Board extends LitElement {
  @property({attribute: false}) options = new Map<string, boolean>();

  static get styles() {
    return css` 
      :host {
        padding: 16px;
      }
      input {
        width: 280px;
      }
      .tiles {
        display: flex;
        flex-wrap: wrap;
      }
    `;
  }

  renderWords(key: string) {
    if (!this.options.get(key)) {
      return ``;
    }
    return WORDS.get(key)!.map((word) =>
      html`<e-word>${word}</e-word>`,
    );
  }

  onTileSizeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.style.setProperty('--tile-size', `${value}px`);
  }

  override render() {
    return html`
      <label>
        Tile Size
        <input type="range" min="60" max="200" value="160" step="1"
            @input=${this.onTileSizeChange}
        >
      </label>
      <div class="tiles">
        ${[...WORDS.keys()].map((key) => this.renderWords(key))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-board': Board;
  }
}
