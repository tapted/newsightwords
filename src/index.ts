import '@material/mwc-button';
import '@material/mwc-snackbar';
import './elements/banner';
import './elements/word';

import {LitElement, css} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {Snackbar} from '@material/mwc-snackbar';
import {html} from 'lit-html';

const LIST1 = ['at', 'I', 'am', 'a', 'the'];
const LIST2 = ['look', 'in', 'my', 'can', 'do'];
const WORDS = [LIST1, LIST2];

@customElement('e-container')
class EContainer extends LitElement {
  @query('mwc-snackbar') snackbar!: Snackbar;

  static get styles() {
    return css` 
      :host {
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
      }
    `;
  }
  onSnackbarClosing(e: CustomEvent) {
    if (e.detail.reason === 'action') {
      console.log('Snackbar action');
    }
  }

  renderWords() {
    return WORDS.flat().map((word) =>
      html`<e-word>${word}</e-word>`,
    );
  }

  override render() {
    return html`
      ${this.renderWords()}
      <mwc-snackbar
          timeoutMs="-1"
          @MDCSnackbar:closing=${this.onSnackbarClosing}>
        <mwc-button slot="action">RESUME</mwc-button>
        <mwc-button slot="dismiss">✖️</mwc-button>
      </mwc-snackbar>
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
