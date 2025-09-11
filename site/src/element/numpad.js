import { delay } from '@axiom/commons';
import { tagName } from './utils.js';

const TAGNAME = tagName('numpad');

const APM = 300;

export class PlayNumpadElement extends HTMLElement {

  static get tagName() {
    return TAGNAME;
  }

  constructor() {
    super();
    this._setup();
  }

  _setup() {
    for (let i = 0; i < 10; i++) {
      this.appendChild(this._buttonElement(`${i}`, `${i}`));
    }
  }

  async type(...values) {
    for (const value of values) {
      this._type(value); // don't wait
      await delay(60 * 1000 / APM);
    }
  }

  async _type(value) {
    const button = this._getButton(value);
    if (!button) {
      throw new Error('Invalid value');
    }
    button.classList.add('active');
    button.dispatchEvent(new MouseEvent('mousedown'));
    await delay(100);
    button.dispatchEvent(new MouseEvent('mouseup'));
    button.classList.remove('active');
  }

  _getButton(value) {
    return this.querySelector(`[data-value="${value}"]`);
  }

  _buttonElement(value, content) {
    const button = document.createElement('div');
    button.classList.add('button');
    button.setAttribute('data-value', value);
    button.textContent = content;
    button.addEventListener('mousedown', () => {
      this.dispatchEvent(new CustomEvent('input', { detail: { value } }));
    });
    return button;
  }

}
