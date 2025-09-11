import { tagName, defineAndUpgrade } from './utils.js';

const TAGNAME = tagName('aftermath');

export function createAftermath({
  results,
}) {
  defineAndUpgrade(PlayAftermathElement);
  const element = document.createElement(TAGNAME);
  element.results = results;
  return element;
}

export class PlayAftermathElement extends HTMLElement {

  static get tagName() {
    return TAGNAME;
  }

  constructor() {
    super();
    this._results = [];
  }

  _setup() {
    this.innerHTML = `
<div class="results">
  ${this._results.map(renderResult).join('')}
</div>`;
    this._refs = {
      results: this.querySelector('.results'),
    };
  }

  connectedCallback() {
    this._setup();
  }

  get results() {
    return this._results;
  }

  set results(results) {
    if (!Array.isArray(results)) {
      throw new Error('Invalid results');
    }
    this._results = results;
  }

}

function renderResult({ challenge, playerAnswer, correct }) {
  return `
<div class="result ${correct ? 'correct' : 'incorrect'}">
  <div class="expression">${challenge.expression}</div>
  <div class="equal-sign">=</div>
  <div class="answer">${playerAnswer}</div>
  <div class="correctness">${correct ? '&nbsp;✓&nbsp;' : `→ ${challenge.answer}`}</div>
</div>`;
}
