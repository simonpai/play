export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function repeat(str, count) {
  let s = '';
  for (let i = 0; i < count; i++) {
    s += str;
  }
  return s;
}
