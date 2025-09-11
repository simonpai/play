export class Resolution {

  constructor() {
    const self = this;
    self.promise = new Promise((resolve, reject) => {
      self.resolve = resolve;
      self.reject = reject;
    });
    Object.freeze(this);
  }

  take(promise) {
    promise.then(value => this.resolve(value));
    promise.catch(error => this.reject(error));
  }

}
