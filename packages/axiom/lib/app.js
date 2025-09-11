import { asContext, isContext } from './context.js';

export class App {

  constructor(options) {
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
    let { context, narrative, name, meta } = buildRunArgs(arg0, arg1);
    if (typeof narrative !== 'function') {
      throw new Error('Narrative must be a function');
    }
    // TODO: keep track of app call stack
    context = context || asContext({ name, meta, app: this.fn });
    return await this._run(narrative, context, 0);
  }

  async _run(narrative, context, index) {
    if (index >= this._middlewares.length) {
      const obj = narrative(context);
      if (typeof obj[Symbol.asyncIterator] !== 'function') {
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
    const next = async (c) => this._run(narrative, c || context, index + 1);
    const middleware = this._middlewares[index];
    return await middleware(context, next);
  }

}

function buildRunArgs(arg0, arg1) {
  switch (typeof arg0) {
    case 'string':
      return { name: arg0, narrative: arg1 };
    case 'object':
      if (Array.isArray(arg0)) {
        arg1 = arg0[1];
        arg0 = arg0[0];
      }
      if (isContext(arg0)) {
        // used as middleware: (context, next) -> value
        return { context: arg0, narrative: arg1 };
      } else {
        const { name, ...meta } = arg0;
        return { name, meta, narrative: arg1 };
      }
    case 'function':
      let { name, ...meta } = arg0.meta || {};
      // use function name if meta.name is not provided
      name = name || arg0.name || undefined;
      return { name, meta, narrative: arg0 };
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
