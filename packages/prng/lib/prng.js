export function prng({ algorithm, ...options } = {}) {
  return new PRNG(algorithm, options);
}

class PRNG {

  constructor(algorithm, options) {
    this._algorithm = algorithm;
    this._core = algorithm(options);
  }

  fork(seed) {
    return prng({ algorithm: this._algorithm, state: this._core.state });
  }

  next() {
    return this._core.next() / 0x100000000;
  }

  nextInt(min = 0, max = 0x100000000) {
    return Math.floor(this.next() * (max - min + 1) + min);
  }

}
