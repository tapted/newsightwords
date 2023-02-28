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
        padding: 20px;
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

  override render() {
    return html`
      ${[...WORDS.keys()].map((key) => this.renderWords(key))}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-board': Board;
  }
}
