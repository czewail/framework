
class Injectable {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this.__ctx__ = null;
  }

  set ctx(ctx) {
    // eslint-disable-next-line no-underscore-dangle
    this.__ctx__ = ctx;
  }

  get ctx() {
    // eslint-disable-next-line no-underscore-dangle
    return this.__ctx__;
  }
}

module.exports = Injectable;
