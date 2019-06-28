const path = require('path');
const Base = require('./base');
const View = require('../view');
const Resource = require('../resource');
const Validate = require('../validate');

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

  validate(data, validator) {
    return new Validate(data, validator);
  }

  get service() {
    const that = this;
    return new Proxy({}, {
      get(target, p, receiver) {
        if (typeof p === 'symbol') return Reflect.get(target, p, receiver);
        return that.app.get(`service.${p}`);
      },
    });
  }

  resource(target) {
    return this.app.get(`resource.${target}`);
  }

  get component() {
    const that = this;
    return new Proxy({}, {
      get(target, p, receiver) {
        if (typeof p === 'symbol') return Reflect.get(target, p, receiver);
        return that.app.get(`component.${p}`, [this.request]);
      },
    });
  }

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
