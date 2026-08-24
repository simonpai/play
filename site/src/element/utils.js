export function tagName(name) {
  return `play-${name}`;
}

export function defineAndUpgrade(...elementClasses) {
  for (const elementClass of elementClasses) {
    defineAndUpgradeOne(elementClass);
  }
}

function defineAndUpgradeOne(elementClass) {
  const { tagName } = elementClass;
  if (!tagName) {
    throw new Error('Element class must have a tagName');
  }
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
  for (const element of document.querySelectorAll(tagName)) {
    customElements.upgrade(element);
  }
}
