export function trimObj(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  const trimmed = {};
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) {
      trimmed[k] = obj[k];
    }
  }
  return trimmed;
}

export function delegateGetters(target, source, propNames) {
  propNames = typeof propNames === 'string' ? [propNames] : propNames;
  Object.defineProperties(target, propNames.reduce((acc, propName) => {
    acc[propName] = {
      get: () => {
        const value = source[propName];
        return typeof value === 'function' ? value.bind(source) : value;
      },
    };
    return acc;
  }, {}));
}

export function defineValues(target, source) {
  for (const name in source) {
    if (source.hasOwnProperty(name)) {
      Object.defineProperty(target, name, { value: source[name] });
    }
  }
}

export function exportValues(source, props) {
  const exported = {};
  for (const name of props) {
    const value = source[name];
    exported[name] = typeof value === 'function' ? value.bind(source) : value;
  }
  return Object.freeze(exported);
}
