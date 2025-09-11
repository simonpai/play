import { VOID_FUNCTION, capitalize, consoleTag } from '@axiom/commons';

export function configDebugger(context, ui) {
  if (!context.debug) {
    return VOID_FUNCTION;
  }
  context.debug.config({
    serialize: serializeEvent,
    consoleTag: tagEvent,
  });
  return (ui.view && ui.view.events) ?
    ui.view.events.subscribe(event => context.debug({ domain: 'view', ...event })) :
    VOID_FUNCTION;
}

function serializeEvent(event) {
  const { domain, name, subject, ...rest } = event;
  return [digestEvent(event), rest];
}

function tagEvent({ domain = 'narrative' } = {}) {
  return consoleTag({ text: capitalize(domain), background: tagColor(domain) });
}

function tagColor(domain) {
  switch (domain) {
    case 'narrative':
      return '#006699';
    case 'view':
      return '#660099';
    default:
      throw new Error(`Unrecognized domain: ${domain}`);
  }
}

function digestEvent({ name, subject } = {}) {
  return subject ? `${subject}:${name}` : name;
}
