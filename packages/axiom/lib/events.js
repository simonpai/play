import { EventQueue } from '@axiom/commons';

export function events(options = {}) {
  return (context, next) => next({
    ...context,
    events: new EventQueue(options),
    createEvent: eventFactory(context),
  });
}

function eventFactory({ name, meta }) {
  const eventContext = Object.freeze({ name, ...meta });
  return (name, data) => Object.freeze({
    name,
    context: eventContext,
    ...data,
  });
}
