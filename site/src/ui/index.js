import { defineElements } from './elements.js';
import { configDebugger } from './debug.js';
import { sprintUi } from './sprint.js';

export function ui(options) {
  defineElements();
  return (context, next) => {
    configDebugger(context);
    return getSubUi(context.name, options)(context, next);
  };
}

function getSubUi(name, options) {
  switch (name) {
    case 'sprint':
      return sprintUi(options);
    default:
      return noopUi();
  }
}

function noopUi() {
  return (context, next) => next(context);
}
