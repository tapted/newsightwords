import './word';

import {LitElement, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {html} from 'lit-html';

const LIST1 = ['at', 'I', 'am', 'a', 'the'];
const LIST2 = ['look', 'in', 'my', 'can', 'do'];
export const WORDS = new Map<string, string[]>([
  ['List 1', LIST1],
  ['List 2', LIST2],
]);

function shuffle(array: string[]) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

@customElement('e-board')
export class Board extends LitElement {
  @property({attribute: false}) options = new Map<string, boolean>();
  @state() wordCount = 10;
  words: string[] = [];

  static get styles() {
    return css` 
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
      }
      input[type="range"] {
        width: 280px;
      }
      .tiles {
        display: flex;
        flex-wrap: wrap;
      }
    `;
  }

  pickWords() {
    this.words.length = 0;
    if (!this.wordCount || this.wordCount < 1) {
      this.wordCount = 1;
    }
    if (this.wordCount > 200) {
      this.wordCount = 200;
    }
    while (this.words.length < this.wordCount) {
      for (const k of WORDS.keys()) {
        if (!this.options.get(k)) {
          continue;
        }
        this.words.push(...WORDS.get(k)!);
      }
      if (this.words.length === 0) {
        break;
      }
    }
    shuffle(this.words);
    this.words.length = this.wordCount;
    this.words = [...this.words, ...this.words];
    shuffle(this.words);
    for (const tile of this.renderRoot.querySelectorAll('e-word')) {
      tile.flip = false;
      tile.match = false;
    }
    this.requestUpdate();
  }

  renderWords() {
    return this.words.map((word) =>
      html`<e-word>${word}</e-word>`,
    );
  }

  onTileSizeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.style.setProperty('--tile-size', `${value}px`);
  }

  onTileCountChange(e: InputEvent) {
    this.wordCount = Number((e.target as HTMLInputElement).value);
    this.pickWords();
  }

  override render() {
    return html`
      <label>
        Tile Size
        <input type="range" min="60" max="200" value="160" step="1"
            @input=${this.onTileSizeChange}
        >
      </label>
      <label>
        Word Count
        <input type="number" min="5" max="200" step="1"
            value=${this.wordCount}
            @input=${this.onTileCountChange}
        >
      </label>
      <div class="tiles">
        ${this.renderWords()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-board': Board;
  }
}
