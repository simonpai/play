import { tagName, defineAndUpgrade } from './utils.js';
import { svgSprite } from '../ui/sprites.js';

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
  ${renderRating(rate({ correct, total, median, max }))}
</div>`;
}

// from best to worst; max time threshold is double the median time threshold
const RATING_LEVELS = [
  { stars: 5, correctness: 1, medianTime: 2000 },
  { stars: 4, correctness: 0.95, medianTime: 2500 },
  { stars: 3, correctness: 0.85, medianTime: 3500 },
  { stars: 2, correctness: 0.75, medianTime: 5000 },
  { stars: 1, correctness: 0.5, medianTime: Infinity },
];

function rate({ correct, total, median, max }) {
  if (total === 0) {
    return 0;
  }
  for (const { stars, correctness, medianTime } of RATING_LEVELS) {
    if (correct / total >= correctness && median <= medianTime && max <= medianTime * 2) {
      return stars;
    }
  }
  return 0;
}

function renderRating(stars) {
  return `
<div class="rating" data-stars="${stars}">
  ${Array.from({ length: 5 }, (_, i) => renderStar(i < stars)).join('')}
</div>`;
}

function renderStar(filled) {
  return svgSprite('star', { classes: filled ? ['star', 'filled'] : ['star'] });
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
  <div class="correctness">${correct ? '&nbsp;✓&nbsp;' : `→ ${challenge.answer}`}</div>
</div>`;
}
