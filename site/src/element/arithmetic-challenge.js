import { delay, repeat, Resolution } from '@axiom/commons';
import { tagName } from './utils.js';

const TAGNAME = tagName('arithmetic-challenge');

export class PlayArithmeticChallengeElement extends HTMLElement {

  static get tagName() {
    return TAGNAME;
  }

  constructor() {
    super();
    this._res = new Resolution();
    this._answer = 0;
    this._digits = 0;
    this._setup();
  }

  _setup() {
    this.innerHTML = `
<div data-role="expression"></div>&nbsp;
<div class="equal-sign">=</div>&nbsp;
<div class="answer" data-role="answer-digits"></div>`;
    this._refs = {
      expression: this.querySelector('[data-role="expression"]'),
      answerDigits: this.querySelector('[data-role="answer-digits"]'),
    };
  }

  connectedCallback() {
    const expression = this._expression = this.getAttribute('expression');
    const answerDigitCount = this._answerDigitCount = Number.parseInt(this.getAttribute('answer-digit-count'), 10);
    if (!expression) {
      throw new Error('Missing attribute "expression"');
    }
    if (isNaN(answerDigitCount)) {
      throw new Error('Invalid or missing attribute "answer-digit-count"');
    }
    this._refs.expression.textContent = expression;
    this._refs.answerDigits.innerHTML = repeat('<span>_</span>', this._answerDigitCount);
  }

  disconnectedCallback() {
  }

  get answer() {
    return this._res.promise;
  }

  async setAnswer(value, { apm = 300 } = {}) {
    const digits = `${value}`.split('');
    if (digits.length !== this._answerDigitCount) {
      throw new Error('Invalid answer');
    }
    for (let i = 0; i < digits.length; i++) {
      if (i > 0) {
        await delay(60 * 1000 / apm);
      }
      this.input(digits[i]);
    }
  }

  input(digit) {
    digit = Number.parseInt(digit, 10);
    if (isNaN(digit) || digit < 0 || digit > 9) {
      throw new Error('Invalid answer digit');
    }
    if (this._digits >= this._answerDigitCount) {
      return; // ignore
    }
    this._answer = this._answer * 10 + digit;
    this._digits++;
    this._refs.answerDigits.children[this._digits - 1].textContent = digit;
    if (this._digits === this._answerDigitCount) {
      this._res.resolve(this._answer);
    }
  }

  rewind() {
    if (this._digits === 0 || this._digits === this._answerDigitCount) {
      return; // nothing to erase, or answer already resolved
    }
    this._digits--;
    this._answer = Math.floor(this._answer / 10);
    this._refs.answerDigits.children[this._digits].textContent = '_';
  }

}
