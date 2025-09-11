import { App } from './app.js';

export function axiom(options) {
  return (new App(options)).fn;
}
