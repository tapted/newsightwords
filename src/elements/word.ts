import {LitElement, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {html} from 'lit-html';

@customElement('e-word')
class EWord extends LitElement {
  @property({type: String}) word = '...';

  static get styles() {
    return css`
      :host {
        display: flex;
        margin: 10px;
        min-width: 200px;
        background-color: pink;
        flex-direction: column;
      }
      :host(:hover) {
        background-color: red;
      }
      h2 {
        font-size: 60pt;
        font-family: 'Edu NSW ACT Foundation', cursive;
        font-weight: unset;
        text-align: center;
      }
      :host(:not(:hover)) h2 {
        visibility: hidden;
      }
    `;
  }
  override render() {
    return html`<h2><slot></slot></h2>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-word': EWord;
  }
}
