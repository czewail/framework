const path = require('path');
const Base = require('./base');
const View = require('../view');

class Controller extends Base {
  constructor(request) {
    super(request);

    this._view = null;
  }

  render(...params) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.render(...params);
  }

  assign(...params) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.assign(...params);
  }

  view(...params) {
    return new View(...params);
  }

  service(servicePath, args = [], force = false) {
    const resolvePath = path.resolve(this.app.servicePath, servicePath);
    if (!this.app.has(resolvePath)) {
      // eslint-disable-next-line
      const requiredService = require(resolvePath);
      this.app.bind(resolvePath, requiredService);
    }
    return this.app.get(resolvePath, args, [this.request], force);
  }
}

module.exports = Controller;
