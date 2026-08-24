import { tagName, defineAndUpgrade } from './utils.js';
import { PlayRatingElement } from './rating.js';

const TAGNAME = tagName('aftermath');

export function createAftermath({
  results,
}) {
  defineAndUpgrade(PlayAftermathElement, PlayRatingElement);
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
    const answerDigits = Math.max(...this._results.map(({ challenge }) => `${challenge.answer}`.length), 1);
    this.innerHTML = `
<div class="results" style="--answer-digits: ${answerDigits}">
  ${this._results.map(renderResult).join('')}
</div>
${renderStats(this._results)}`;
    this._refs = {
      results: this.querySelector('.results'),
      stats: this.querySelector('.stats'),
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

function renderStats(results) {
  const total = results.length;
  const correct = results.filter(({ correct }) => correct).length;
  const durations = results.map(({ duration }) => duration).sort((a, b) => a - b);
  const median = medianOf(durations);
  const max = durations[durations.length - 1];
  return `
<div class="stats">
  ${renderStat('correctness', 'Correct', `${correct}/${total}`)}
  ${renderStat('median-time', 'Median', formatDuration(median))}
  ${renderStat('max-time', 'Max', formatDuration(max))}
  <play-rating class="rating" rating="${rate({ correct, total, median, max })}"></play-rating>
</div>`;
}

// rating is measured in half-stars (rating = 2 * stars), from best to worst;
// max time threshold is double the median time threshold
const RATING_LEVELS = [
  { rating: 10, correctness: 1, medianTime: 2000 },
  { rating: 9, correctness: 0.975, medianTime: 2500 },
  { rating: 8, correctness: 0.95, medianTime: 3500 },
  { rating: 7, correctness: 0.9, medianTime: 5000 },
  { rating: 6, correctness: 0.85, medianTime: 7000 },
  { rating: 5, correctness: 0.75, medianTime: 10000 },
  { rating: 4, correctness: 0.65, medianTime: Infinity },
  { rating: 3, correctness: 0.5, medianTime: Infinity },
  { rating: 2, correctness: 0.35, medianTime: Infinity },
];

function rate({ correct, total, median, max }) {
  if (total === 0) {
    return 0;
  }
  for (const { rating, correctness, medianTime } of RATING_LEVELS) {
    // the required correct count is rounded down, e.g. 97.5% of 20 -> 19
    if (correct >= Math.floor(correctness * total) && median <= medianTime && max <= medianTime * 2) {
      return rating;
    }
  }
  return 0;
}

function renderStat(name, label, value) {
  return `
<div class="stat ${name}">
  <div class="label">${label}</div>
  <div class="value">${value}</div>
</div>`;
}

function medianOf(sorted) {
  const { length } = sorted;
  if (length === 0) {
    return undefined;
  }
  const mid = length >> 1;
  return length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatDuration(millis) {
  return millis === undefined ? '-' : `${(millis / 1000).toFixed(1)}s`;
}

function renderResult({ challenge, playerAnswer, correct }) {
  return `
<div class="result ${correct ? 'correct' : 'incorrect'}">
  <div class="expression">${challenge.expression}</div>
  <div class="equal-sign">=</div>
  <div class="answer">${playerAnswer}</div>
  <div class="correction">
    <span class="arrow">→</span>
    <span class="value">${correct ? '✓' : challenge.answer}</span>
  </div>
</div>`;
}
