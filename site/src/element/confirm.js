import { Resolution } from '@axiom/commons';
import { tagName } from './utils.js';

const TAGNAME = tagName('confirm');

export class PlayConfirmElement extends HTMLElement {

  static get tagName() {
    return TAGNAME;
  }

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
    this.reset();
  }

  connectedCallback() {
    // TODO: take spacebar/enter as confirmation as well
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
  }

  _handleClick(event) {
    if (event.button !== 0) {
      return; // left-click only
    }
    if (!event.target.closest('[data-role="confirm"]')) {
      return;
    }
    this._resolution.resolve();
  }

  confirm() {
    const button = this.querySelector('[data-role="confirm"]');
    if (button) {
      button.click();
    } else {
      this._resolution.resolve();
    }
  }

  reset() {
    this._resolution && this._resolution.reject();
    this._resolution = new Resolution();
  }

  get confirmed() {
    return this._resolution.promise;
  }

}
