const path = require('path');
const Base = require('./base');
const View = require('../view');
const Resource = require('../resource');

class Controller extends Base {
  constructor(request) {
    super(request);

    this._view = null;

    this._item = null;

    this._collection = null;
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

  // createServicePathProxy() {
  //   const that = this;
  //   return new Proxy({}, {
  //     get(target, prop, receiver) {
  //       console.log(prop);
  //       if (prop === 'valueOf') {
  //         return 11111;
  //       }
  //       return that.createServicePathProxy(prop);
  //     },
  //   });
  // }

  // get services() {
  //   return this.createServicePathProxy();
  // }

  /**
   * create item resouce instance
   * @param  {...any} params
   */
  item(...params) {
    if (!this._item) {
      this._item = new Resource.Item(...params);
    }
    return this._item;
  }

  /**
   * create collection resouce instance
   * @param  {...any} params
   */
  collection(...params) {
    if (!this._collection) {
      this._collection = new Resource.Collection(...params);
    }
    return this._collection;
  }
}

module.exports = Controller;
