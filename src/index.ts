import './elements/word';

import {LitElement, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {html} from 'lit-html';

const LIST1 = ['at', 'I', 'am', 'a', 'the'];
const LIST2 = ['look', 'in', 'my', 'can', 'do'];
const WORDS = [LIST1, LIST2];

@customElement('e-container')
class EContainer extends LitElement {
  static get styles() {
    return css` 
      :host {
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
      }
    `;
  }
  renderWords() {
    return WORDS.flat().map((word) =>
      html`<e-word>${word}</e-word>`,
    );
  }

  override render() {
    return html`
      ${this.renderWords()}
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
