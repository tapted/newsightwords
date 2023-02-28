import '@material/mwc-button';
import '@material/mwc-snackbar';
import './elements/banner';

import {LitElement, css} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {Snackbar} from '@material/mwc-snackbar';
import {html} from 'lit-html';

@customElement('e-container')
class EContainer extends LitElement {
  @query('mwc-snackbar') snackbar!: Snackbar;

  static get styles() {
    return css` 
      :host {
        display: flex;
        flex-direction: row;
        height: 90vh;
        overflow-x: scroll;
        overflow-y: hidden;
        width: 100vw;
      }
      :host::-webkit-scrollbar {
        display: none;
      }
    `;
  }
  onSnackbarClosing(e: CustomEvent) {
    if (e.detail.reason === 'action') {
      console.log('Snackbar action');
    }
  }
  override render() {
    return html`
      <e-banner></e-banner>
      &middot;
      <mwc-button
          @click=${() => this.snackbar.show()}>
        Yourstuff
      </mwc-button>
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
