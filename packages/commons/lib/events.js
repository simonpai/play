import { IDENTITY_FUNCTION, ALWAYS_TRUE_FUNCTION } from './functions.js';
import { Resolution } from './resolution.js';

export class EventQueue {

  _executing = false;
  _queue = [];
  _subscribers = [];

  constructor(options = {}) {
    this._options = normalizeOptions(options);
  }

  get executing() {
    return this._executing;
  }

  async emit(event) {
    const res = new Resolution();
    this._queue.push([event, res]);

    if (!this._executing) {
      this._executing = true;
      while (this._queue.length > 0) {
        const [event, res] = this._queue.shift();
        try {
          res.take(Promise.all(this._subscribers.map(subscriber => subscriber(event))));
        } catch (error) {
          res.reject(error);
        }
      }
      this._executing = false;
    }

    return res.promise;
  }

  subscribe(callback) {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter(cb => cb !== callback);
    };
  }

  pipe(target, { mapping = IDENTITY_FUNCTION, filter = ALWAYS_TRUE_FUNCTION } = {}) {
    return this.subscribe(event => filter(event) && target.emit(mapping(event)));
  }

}

function normalizeOptions({ onError = error => console.error(error), ...options } = {}) {
  return Object.freeze({
    onError,
    ...options,
  });
}
