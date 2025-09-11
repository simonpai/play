export function removeItem(array, item) {
  if (!array) {
    return;
  }
  const i = array.indexOf(item);
  if (i > -1) {
    array.splice(i, 1);
  }
}

export function asArray(value) {
  return Array.isArray(value) ? value : (value === undefined) ? [] : [value];
}
