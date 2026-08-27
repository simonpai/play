import { axiom } from './axiom.js';
import { createEvent } from './utils.js';

export function minigame(options = {}) {
  options = normalizeOptions(options);

  return axiom({
    name: 'minigame',
    ...options,
  }, async function* (context) {
    const minigame = context.minigames.get(options.minigame);

    yield createEvent('start');

    const aftermath = await minigame(options);

    yield createEvent('end', { aftermath });

    return aftermath;
  });
}

function normalizeOptions(options = {}) {
  if (!options.minigame) {
    throw new Error('No minigame specified');
  }
  return options;
}
