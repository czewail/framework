/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');
const View = require('../view');
const Resource = require('../resource');
const Validate = require('../validate');

class Controller extends Base {
  /**
   * Create Controller base context
   * @param {Object} request
   */
  constructor(request) {
    super();

    /**
     * @var {Request} _request Request instance
     */
    this._request = request;
  }

  /**
   * @var {Object} request request instance
   */
  get request() {
    return this._request;
  }

  /**
   * render view template
   * @param  {...any} params
   */
  render(...params) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.render(...params);
  }

  /**
   * assign view data
   * @param  {...any} params
   */
  assign(...params) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.assign(...params);
  }

  /**
   * get view instance
   * @param  {...any} params
   */
  view(...params) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view;
  }

  /**
   * get resource methods
   * @param {String} resourceName
   */
  resource(resourceName) {
    return {
      item(data) {
        return new Resource.Item(data, resourceName);
      },
      collection(data) {
        return new Resource.Collection(data, resourceName);
      },
    };
  }

  /**
   * get service
   * @param {String} serviceName
   * @param {Array} args
   */
  service(serviceName, args = []) {
    return this.app.get(`service.${serviceName}`, args);
  }

  /**
   * get component
   * @param {String} componentName
   * @param {Array} args
   */
  component(componentName, args = []) {
    return this.app.get(`component.${componentName}`, args);
  }

  /**
   * validate a data
   * @param {Mixed} data
   * @param {Object | String} validator
   */
  validate(data, validator) {
    return new Validate(data, validator);
  }

  /**
   * create item resouce instance
   * @param  {...any} params
   */
  item(data, resourceName) {
    return new Resource.Item(data, resourceName);
  }

  /**
   * create collection resouce instance
   * @param  {...any} params
   */
  collection(data, resourceName) {
    return new Resource.Collection(data, resourceName);
  }
}

module.exports = Controller;
