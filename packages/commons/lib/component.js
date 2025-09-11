import { EventQueue } from './events.js';

export class Component {

  _events = new EventQueue();
  _children = [];
  _unsubscribes = [];

  get events() {
    return this._events;
  }

  exit() {
    for (const unsubscribe of this._unsubscribes) {
      unsubscribe();
    }
    for (const child of this._children) {
      typeof child.exit === 'function' && child.exit();
    }
  }

}
