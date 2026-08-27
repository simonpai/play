import { Component } from '@axiom/commons';

export function minigames(options = {}) {
  const registry = new MinigameRegistry();
  const middleware = (context, next) => next({ ...context, minigames: new Minigames(registry, context, options) });
  middleware.add = (...args) => {
    registry.add(...args);
    return middleware;
  };
  return middleware;
}

class MinigameRegistry {

  _games = new Map();

  add(game) {
    this._games.set(game.name, game);
  }

  get(name) {
    const game = this._games.get(name);
    if (!game) {
      throw new Error(`Unknown minigame: ${name}`);
    }
    return game;
  }

}

class Minigames extends Component {

  _registry;
  _options;

  constructor(registry, context, options = {}) {
    super();
    this._registry = registry;
    this._options = options;
  }

  get(name) {
    return this._registry.get(name);
  }

}
