import {LitElement, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {html} from 'lit-html';

@customElement('e-word')
class EWord extends LitElement {
  @property({type: Boolean, reflect: true}) flip = false;

  constructor() {
    super();
    this.addEventListener('pointerdown', () => {
      this.flip = !this.flip;
    });
  }

  static get styles() {
    return css`
      :host {
        padding: 20px;
        position: relative;
      }
      :host, .front, .back {
        height: 200px;
        width: 200px;
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
        padding: 2rem;
        position: absolute;
        text-align: center;
        top: 0;
        transition: transform .3s ease;
      }
      /* front side bg is green gradient */
      .front {
        background-image: linear-gradient(to right bottom, #2ecc71, #229955);
      }
      /* back side bg is orange gradient */ 
      .back {
        background-image: linear-gradient(to right bottom, #f1c40f, #e67e22);
      }
      
      h2 {
        font-family: 'Edu NSW ACT Foundation', cursive;
        font-size: 60pt;
        font-weight: unset;
        text-align: center;
      }
      .back {
        transform: rotateY(180deg);
      }
      :host([flip]) .front {
        transform: rotateY(-180deg);
      }
      :host([flip]) .back {
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
