import {LitElement, css} from 'lit';
import {addUserObserver, loginWithGoogle} from '../db/fire/app';
import {customElement, state} from 'lit/decorators.js';
import {html} from 'lit-html';

@customElement('e-banner')
class EBanner extends LitElement {
  @state() displayName = '';

  constructor() {
    super();
    addUserObserver((user) => {
      this.displayName = user.displayName ?? '';
    });
  }

  static get styles() {
    return css` 
    `;
  }
  override render() {
    if (!this.displayName) {
      return html`
        <mwc-button
            @click=${() => loginWithGoogle()}>
          Login
        </mwc-button>`;
    }
    return html`<h2>${this.displayName}</h2>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'e-banner': EBanner;
  }
}
