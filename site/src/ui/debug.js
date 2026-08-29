import { VOID_FUNCTION, capitalize, consoleTag } from '@axiom/commons';

export function configDebugger(context) {
  if (!context.debug) {
    return;
  }
  context.debug.config({
    serialize: serializeEvent,
    consoleTag: tagEvent,
  });
}

export function debugViewEvents(context, view) {
  if (!context.debug || !view || !view.events) {
    return VOID_FUNCTION;
  }
  return view.events.subscribe(event => context.debug({ domain: 'view', ...event }));
}

function serializeEvent(event) {
  const { domain, name, context, ...rest } = event;
  return [context ? `[${context.name}] ${name}` : name, rest];
}

function tagEvent({ domain = 'logic' } = {}) {
  return consoleTag({ text: capitalize(domain), background: tagColor(domain) });
}

function tagColor(domain) {
  switch (domain) {
    case 'logic':
      return '#006699';
    case 'view':
      return '#660099';
    default:
      throw new Error(`Unrecognized domain: ${domain}`);
  }
}
