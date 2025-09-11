import { splitMix32, rotl } from './utils.js';

export function xoshiro128({ state, seed } = {}) {
  return new Xoshiro128(state || toState(seed));
}

function toState(seed = 1) {
  if (Array.isArray(seed) && seed.length === 4) {
    return [...seed];
  }
  const gen = splitMix32(seed);
  return [gen(), gen(), gen(), gen()];
}

class Xoshiro128 {

  constructor(state) {
    this._state = state;
  }

  get state() {
    return [...this._state];
  }

  next() {
    const state = this._state;

    const value = rotl(state[1] * 5 >>> 0, 7) * 9 >>> 0;
    
    const t = state[1] << 9 >>> 0;
    state[2] ^= state[0];
    state[3] ^= state[1];
    state[1] ^= state[2];
    state[0] ^= state[3];
    state[2] ^= t;
    state[3] = rotl(state[3], 11);

    return value;
  }

}
