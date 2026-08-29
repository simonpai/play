import { VOID_FUNCTION } from '@axiom/commons';
import { animate } from '../util/animations.js';

export async function countdown(container, {
  count = 3,
  interval = 1000,
  display = (count) => `${count}`,
  effect = VOID_FUNCTION,
} = {}) {
  effect = normalizeEffect(effect);

  const span = document.createElement('span');
  span.classList.add('countdown-text');
  const element = document.createElement('div');
  element.classList.add('countdown');
  element.appendChild(span);
  container.appendChild(element);

  function onCount(count) {
    span.textContent = display(count);
    effect(span); // don't wait
  }

  await _countdown(count, interval, onCount);

  container.removeChild(element);
}

function _countdown(count, interval, onCount) {
  // may use signals in the future
  return new Promise(resolve => {
    onCount(count);
    let intervalId;
    intervalId = setInterval(() => {
      count--;
      if (count >= 0) {
        onCount(count);
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);
  });
}

function normalizeEffect(effect) {
  if (typeof effect === 'string') {
    return (element) => animate(element, effect);
  }
  if (Array.isArray(effect)) {
    return (element) => animate(element, ...effect);
  }
  if (typeof effect !== 'function') {
    throw new Error('Invalid effect');
  }
  return effect;
}
