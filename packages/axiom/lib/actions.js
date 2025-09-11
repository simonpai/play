export default class ActionQueue {

  _queue = [];
  _resolvers = [];

  enqueue(action) {
    this._queue.push(action);
    const resolver = this._resolvers.shift();
    if (resolver) {
      resolver();
    }
  }

  [Symbol.asyncIterator]() {
    // TODO: multiple retrivers
    return {
      next: async () => {
        if (this._queue.length === 0) {
          // wait for new events when queue is empty
          await new Promise(resolve => this._resolvers.push(resolve));
        }        
        const value = this._queue.shift();
        return { value, done: false };
      }
    };
  }

}
