export function createEvent(name, data) {
  return Object.freeze({
    name,
    ...data,
  });
}
