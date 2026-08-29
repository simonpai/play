import { createElement } from './dom.js';

const ID_PREFIX = 'play-sprite-';

const SPRITES = {
  star: {
    viewBox: '0 0 24 24',
    content: '<path d="M12 2l2.94 6.36 6.96.8-5.15 4.73 1.38 6.86L12 17.27l-6.13 3.48 1.38-6.86L2.1 9.16l6.96-.8z"/>',
  },
};

let sheet;

export function svgSprite(name, { classes = [] } = {}) {
  const sprite = SPRITES[name];
  if (!sprite) {
    throw new Error(`Unknown sprite: ${name}`);
  }
  mountSprites();
  return `<svg class="${classes.join(' ')}" viewBox="${sprite.viewBox}" aria-hidden="true"><use href="#${ID_PREFIX}${name}"/></svg>`;
}

export function mountSprites() {
  if (!sheet) {
    sheet = createElement(`
<svg class="sprites" style="display: none" aria-hidden="true">
  ${Object.entries(SPRITES).map(([name, { viewBox, content }]) => `<symbol id="${ID_PREFIX}${name}" viewBox="${viewBox}">${content}</symbol>`).join('')}
</svg>`);
  }
  if (!sheet.isConnected) {
    document.body.appendChild(sheet);
  }
}
