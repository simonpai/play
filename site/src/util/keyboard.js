// A single document-level keydown listener shared by all bindings.
const handlers = new Set();

function handleKeydown(event) {
  for (const handler of [...handlers]) {
    handler(event);
  }
}

export function bindKeydown(handler) {
  if (handlers.size === 0) {
    document.addEventListener('keydown', handleKeydown);
  }
  handlers.add(handler);
  return () => {
    if (handlers.delete(handler) && handlers.size === 0) {
      document.removeEventListener('keydown', handleKeydown);
    }
  };
}
