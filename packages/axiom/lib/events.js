import { EventQueue } from '@axiom/commons';

export function events(options = {}) {
  return (context, next) => next({ ...context, events: new EventQueue(options) });
}
