import {LitElement, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {html} from 'lit-html';

function unflip(tiles: EWord[]) {
  for (const t of tiles) {
    t.flip = false;
  }
}

@customElement('e-word')
export class EWord extends LitElement {
  @property({type: Boolean, reflect: true}) flip = false;
  @property({type: Boolean, reflect: true}) match = false;

  constructor() {
    super();
    this.addEventListener('pointerdown', async () => {
      if (this.match) {
        return;
      }
      this.flip = !this.flip;
      await this.updateComplete;
      this.markMatches();
    });
  }

  markMatches() {
    const flipped = [...this.parentElement!.querySelectorAll('e-word[flip]')!] as EWord[];
    if (flipped.length < 2) {
      return;
    }
    const word = flipped[0].innerText;
    for (let i = 1; i < flipped.length; ++i) {
      if (flipped[i].innerText !== word) {
        setTimeout(() => unflip(flipped), 500);
        return;
      }
    }
    for (const tile of flipped) {
      tile.match = true;
      tile.flip = false;
    }
    this.dispatchEvent(new CustomEvent('got-match', {composed: true, bubbles: true}));
  }

  static get styles() {
    return css`
      :host {
        padding: 8px;
        position: relative;
      }
      :host, .front, .back {
        height: var(--tile-size, 180px);
        width: var(--tile-size, 180px);
      }
      .front, .back {
        backface-visibility: hidden;
        border-radius: 4px;
        box-shadow: 0 1rem 2rem rgba(0, 0, 0, .25);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        left: 0;
        overflow: hidden;
        padding: 8px;
        position: absolute;
        text-align: center;
        top: 0;
        transition: transform .3s ease;
      }
      h2 {
        font-family: 'Edu NSW ACT Foundation', cursive;
        font-size: calc(var(--tile-size, 180px) * 0.5);
        font-weight: unset;
        text-align: center;
      }
      /* back side bg is orange gradient */ 
      .back {
        background-image: linear-gradient(to right bottom, #f1c40f, #e67e22);
        transform: rotateY(180deg);
      }
      /* front side bg is green gradient */
      .front,
      :host([match]) .back {
        background-image: linear-gradient(to right bottom, #2ecc71, #229955);
      }
      :host(:where([flip],[match])) .front {
        transform: rotateY(-180deg);
      }
      :host(:where([flip],[match])) .back {
        transform: rotateY(0deg);
      }
    `;
  }
  override render() {
    return html`
      <div class="front">
      </div>
      <div class="back">
        <h2><slot></slot></h2>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-word': EWord;
  }
}
