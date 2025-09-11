import { prng as _prng, xoshiro128, randomSeed } from '@axiom/prng';

export function prng(options) {
  const prng = _prng(normalizeOptions(options));
  return (context, next) => next({ ...context, prng });
}

function normalizeOptions(options = {}) {
  if (typeof options !== 'object') {
    options = { seed: options };
  }
  const { algorithm = xoshiro128, seed = randomSeed(), ...rest } = options;
  return Object.freeze({
    algorithm,
    seed,
    ...rest,
  });
}
