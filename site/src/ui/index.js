import { sprintUi } from './sprint.js';

export function ui(options) {
  return (context, next) => getSubUi(context.name, options)(context, next);
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
