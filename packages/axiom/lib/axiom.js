import { asContext, isContext } from './context.js';

export function createAxiom(options = {}) {
  return (new Axiom(options)).fn;
}

export class Axiom {

  constructor(options = {}) {
    this._options = options;
    this._middlewares = [];
    Object.defineProperty(this, 'fn', { value: asFunction(this) });
  }

  use(middleware) {
    if (typeof middleware.asMiddleware === 'function') {
      middleware = middleware.asMiddleware;
    }
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
    this._middlewares.push(middleware);
    return this;
  }

  async run(arg0, arg1) {
    let { context, logic, name, meta } = buildRunArgs(arg0, arg1);
    if (typeof logic !== 'function') {
      throw new Error('Logic must be a function');
    }
    // TODO: keep track of app call stack
    context = context || asContext({ name, meta, app: this.fn });
    return await this._run(logic, context, 0);
  }

  async _run(logic, context, index) {
    if (index >= this._middlewares.length) {
      const obj = logic(context);
      if (!obj || typeof obj[Symbol.asyncIterator] !== 'function') {
        return obj;
      }
      // each yield goes to events, if available
      const { events } = context;
      let returnValue;
      while (true) {
        const { value, done } = await obj.next();
        if (!done && events) {
          await events.emit(value);
        }
        if (done) {
          returnValue = value;
          break;
        }
      }
      return returnValue;
    }
    const next = async (c) => this._run(logic, c || context, index + 1);
    const middleware = this._middlewares[index];
    return await middleware(context, next);
  }

}

function buildRunArgs(arg0, arg1) {
  switch (typeof arg0) {
    case 'string':
      return { name: arg0, logic: arg1 };
    case 'object':
      if (Array.isArray(arg0)) {
        arg1 = arg0[1];
        arg0 = arg0[0];
      }
      if (isContext(arg0)) {
        // used as middleware: (context, next) -> value
        return { context: arg0, logic: arg1 };
      } else {
        const { name, ...meta } = arg0;
        return { name, meta, logic: arg1 };
      }
    case 'function':
      let { name, ...meta } = arg0.meta || {};
      // use function name if meta.name is not provided
      name = name || arg0.name || undefined;
      return { name, meta, logic: arg0 };
    default:
      throw new Error('Invalid arguments for app()');
  }
}

function asFunction(app) {
  const fn = (...args) => app.run(...args);
  Object.defineProperties(fn, {
    use: {
      value: app.use.bind(app),
    },
  });
  return fn;
}
