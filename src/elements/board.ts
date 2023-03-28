import './word';

import {LitElement, css} from 'lit';
import {customElement, property, query, queryAll, state} from 'lit/decorators.js';
import {EWord} from './word';
import {html} from 'lit-html';

const LIST1 = ['at', 'I', 'am', 'a', 'the'];
const LIST2 = ['look', 'in', 'my', 'can', 'do'];
const LIST3 = ['to', 'up', 'see', 'go', 'is'];
const LIST4 = ['it', 'we', 'like', 'and', 'mum'];
const LIST5 = ['with', 'on', 'are', 'some', 'little'];
const LIST6 = ['here', 'dad', 'went', 'this', 'for'];

export const WORDS = new Map<string, string[]>([
  ['List 1', LIST1],
  ['List 2', LIST2],
  ['List 3', LIST3],
  ['List 4', LIST4],
  ['List 5', LIST5],
  ['List 6', LIST6],
  ['Custom', []],
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
  @property({type: Boolean, reflect: true}) finished = false;
  @property({attribute: false}) options = new Map<string, boolean>();
  @state() wordCount = 10;
  @query('#custom-words') customWords!: HTMLInputElement;
  @query('.reset-button', true) resetButton!: HTMLButtonElement;
  @queryAll('e-word') tiles!: EWord[];

  words: string[] = [];

  static get styles() {
    return css` 
      :host {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 0 0 0 16px;
      }
      input[type="range"] {
        width: 280px;
      }
      .tiles-container {
        height: 100%;
        position: relative;
        width: 100%;
      }
      .tiles {
        display: flex;
        flex-wrap: wrap;
        padding-top: 8px;
        transition: opacity 2s;
      }
      .middle {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
        left: 0;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        top: 0;
        transition: opacity 2s;
        width: 100%;
      }
      .reset-button {
        height: var(--tile-size, 180px);
        width: var(--tile-size, 180px);
      }
      :host([finished]) .tiles {
        opacity: 0.5;
      }
      :host([finished]) .middle {
        opacity: 1;
        pointer-events: auto;
      }
      :host([finished]) .reset-butto {
        opacity: 1;
      }
      .custom-words-row {
        display: flex;
        padding: 0 16px 0 0;
      }
      .label-row {
        display: flex;
        flex: 1;
        gap: 4px;
        padding: 0 16px 0 0;
      }
      .label-row input {
        flex: 1;
      }
      #word-count {
        max-width: 40px;
      }
    `;
  }

  constructor() {
    super();
    this.style.setProperty('--tile-size', `min(130px, 20vw)`);
    this.addEventListener('got-match', () => this.checkMatch());
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
    for (const tile of this.tiles) {
      tile.flip = false;
      tile.match = false;
    }
    this.requestUpdate();
  }

  onCustomWordsChange() {
    const words = this.customWords.value.split(/(\s+)/).filter((e) => e.trim().length > 0);
    WORDS.set('Custom', words);
    this.pickWords();
  }

  useAnimals() {
    this.customWords.value = '🐕️ 🐈‍ 🐁 🐄 🐘';
    this.onCustomWordsChange();
  }

  onTileSizeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.style.setProperty('--tile-size', `min(${value}px, 0.15*${value}vw)`);
  }

  onTileCountChange(e: InputEvent) {
    this.wordCount = Number((e.target as HTMLInputElement).value);
    this.pickWords();
  }

  private checkMatch() {
    for (const w of this.tiles) {
      if (!w.match) {
        return;
      }
    }
    this.finishGame();
  }

  private finishGame() {
    this.finished = true;
    const tx = this.resetButton.offsetLeft;
    const ty = this.resetButton.offsetTop;
    for (const w of this.tiles) {
      w.flip = true;
      w.match = true;
      const dx = tx - w.offsetLeft;
      const dy = ty - w.offsetTop;
      const transform = `translate(${dx}px, ${dy}px)`;
      const keyframes: Keyframe[] = [
        {
          transform: 'translate(0,  0)',
        },
        {
          easing: 'ease-out',
          transform,
        },
      ];
      w.animate(keyframes, 2000);
      w.style.transform = transform;
    }
  }

  private resetGame() {
    this.pickWords();
    this.finished = false;
    for (const w of this.tiles) {
      w.style.transform = '';
    }
  }

  renderWords() {
    return this.words.map((word) =>
      html`<e-word>${word}</e-word>`,
    );
  }

  override render() {
    return html`
      <div class="custom-words-row">
        <label class="label-row">
          Custom Words:
          <input id="custom-words" type="text" placeholder="one two 🐶" size="10"
              @change=${this.onCustomWordsChange}
          >
        </label>
        <button @click=${this.useAnimals}>Animals</button>
      </div>
      <label class="label-row">
        Tile Size:
        <input type="range" min="60" max="200" value="130" step="1"
            @input=${this.onTileSizeChange}
        >
      </label>
      <label class="label-row">
        Word Count:
        <input id="word-count" type="number" min="2" max="200" step="1" size="3"
            value=${this.wordCount}
            @input=${this.onTileCountChange}
        >
        <input type="range" min="2" max="200" step="1" value="10"
            @input=${this.onTileCountChange}
        >
      </label>
      <div class="tiles-container">
        <div class="tiles">
          ${this.renderWords()}
        </div>
        <div class="middle">
          <button class="reset-button" @click=${this.resetGame}>
            Congratulations! Play Again?
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-board': Board;
  }
}
