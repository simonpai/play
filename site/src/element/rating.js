import { tagName } from './utils.js';
import { svgSprite } from '../ui/sprites.js';

const TAGNAME = tagName('rating');

const STAR_COUNT = 5;

// rating is measured in half-stars, i.e. 10 = 5 stars
export const MAX_RATING = STAR_COUNT * 2;

export class PlayRatingElement extends HTMLElement {

  static get tagName() {
    return TAGNAME;
  }

  static get observedAttributes() {
    return ['rating'];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  get rating() {
    const rating = Number.parseInt(this.getAttribute('rating'), 10);
    return isNaN(rating) ? 0 : Math.max(0, Math.min(MAX_RATING, rating));
  }

  set rating(rating) {
    this.setAttribute('rating', rating);
  }

  _render() {
    const { rating } = this;
    this.innerHTML = Array.from({ length: STAR_COUNT }, (_, i) => renderStar(rating - i * 2)).join('');
  }

}

function renderStar(rating) {
  // rating relative to this star: >= 2 full, 1 half, <= 0 empty
  if (rating === 1) {
    return `<span class="star half">${svgSprite('star', { classes: ['under'] })}${svgSprite('star', { classes: ['over'] })}</span>`;
  }
  return svgSprite('star', { classes: rating >= 2 ? ['star', 'filled'] : ['star'] });
}
