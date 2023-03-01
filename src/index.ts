import './elements/board';

import {Board, WORDS} from './elements/board';
import {LitElement, css} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {html} from 'lit-html';

@customElement('e-container')
class EContainer extends LitElement {
  lists = new Map<string, boolean>([...WORDS.keys()].map((k) => [k, true]));

  @query('e-board') board!: Board;

  static get styles() {
    return css` 
      :host {
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
      }
    `;
  }

  override firstUpdated() {
    this.board.pickWords();
  }

  renderCheck(key: string) {
    return html`
      <label>
        <li>
          <input
              type="checkbox"
              @change=${() => {
    this.lists.set(key, !this.lists.get(key));
    this.board.pickWords();
  }}
              ?checked=${this.lists.get(key)}>
          ${key}
        </li>
      </label>`;
  }

  override render() {
    return html`
      <ul>  
        ${[...WORDS.keys()].map((key) => this.renderCheck(key))}
      </ul>
      <e-board .options=${this.lists}><e-board>
    `;
  }
}

const container = new EContainer();
export let firstFullLoad = Promise.resolve();

async function initPages() {
  await container.updateComplete;
}

document.addEventListener('DOMContentLoaded', ()=> {
  document.body.appendChild(container);
  firstFullLoad = initPages();
});

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
});
