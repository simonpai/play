import { axiom } from './axiom.js';

export function minigame(options = {}) {
  options = normalizeOptions(options);

  return axiom({
    name: 'minigame',
    options,
  }, async function* ({ createEvent, minigames }) {

    // resolve minigame from the registry
    const minigame = minigames.get(options.minigame);

    // start
    yield createEvent('start');

    const aftermath = await minigame(options);

    // end
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
