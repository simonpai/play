import { IDENTITY_FUNCTION, Component, asArray, consoleTag } from '@axiom/commons';

export function debug(options) {
  return async (context, next) => {
    if (!context.events) {
      return next(context);
    }
    const _debugger = new Debugger(context, options);
    const debug = event => _debugger.log(event);
    Object.defineProperties(debug, {
      config: {
        value: options => _debugger.config(options),
      },
    });
    const returnValue = await next({ ...context, debug });
    _debugger.exit();
    return returnValue;
  };
}

class Debugger extends Component {

  constructor(context, options) {
    super();
    this._context = context;
    this._options = normalizeOptions(options);
    this._unsubscribes.push(context.events.subscribe(event => this.log(event)));
  }

  config(options) {
    this._options = mergeOptions(this._options, options);
    return this;
  }

  log(event) {
    const { output, serialize } = this._options;
    if (typeof output === 'function') {
      output(serialize(event));
      return;
    }
    switch (output) {
      case 'console':
        console.log(...consoleTag(this._options.consoleTag, event), ...asArray(serialize(event)));
        break;
      default:
        throw new Error('Invalid output type/function');
    }
  }

}

function normalizeOptions({
  output = 'console',
  consoleTag = {},
  serialize = getDefaultSerializeFn(),
  ...options
} = {}) {
  return Object.freeze({
    output,
    consoleTag,
    serialize,
    ...options,
  });
}

function mergeOptions(base, overrides) {
  overrides = normalizeOptions(overrides);
  return {
    ...base,
    ...overrides,
    consoleTag: mergeConsoleTagOptions(base.consoleTag, overrides.consoleTag),
  };
}

function mergeConsoleTagOptions(base, overrides) {
  if (typeof overrides !== 'object' || typeof base !== 'object') {
    return overrides;
  }
  return {
    ...base,
    ...overrides,
  };
}

function getDefaultSerializeFn() {
  // if in Node.js, return JSON.stringify
  if (typeof process !== 'undefined') {
    return JSON.stringify;
  }
  // if in browser, return v => v
  return IDENTITY_FUNCTION;
}
