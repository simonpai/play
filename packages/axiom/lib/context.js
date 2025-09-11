import { trimObj } from '@axiom/commons';

const CONTEXT_SYMBOL = Symbol('context');

export function asContext(obj) {
  if (isContext(obj)) {
    return obj;
  }
  return Object.freeze({
    ...trimObj(obj),
    [CONTEXT_SYMBOL]: true,
  });
}

export function isContext(obj) {
  return !!(obj && obj[CONTEXT_SYMBOL]);
}
