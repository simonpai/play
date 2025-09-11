export function consoleTag(options, event) {
  if (typeof options === 'function') {
    options = options(event);
  }
  if (!options) {
    return [];
  }
  if (Array.isArray(options)) {
    return options;
  }
  const { text = 'Axiom', color = '#eee', background = '#660099' } = options;
  return [
    `%c${text}`,
    `color: ${color}; background-color: ${background}; padding: 2px 4px 1px 4px;`,
  ];
}
