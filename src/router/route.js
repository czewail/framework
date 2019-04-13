/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const pathToRegExp = require('path-to-regexp');
const Middleware = require('../middleware');
const Meta = require('../foundation/support/meta');

class Route {
  /**
   * Create Route
   * @param {String} uri route URI
   * @param {Array} methods route methods
   * @param {Controller} controller controller
   * @param {String} action controller action
   * @param {Array} middlewares route middlewares
   */
  constructor(uri, methods = [], controller = null, action = '') {
    /**
     * @var {Array} keys route params keys
     */
    this.keys = [];

    /**
     * @var {String} uri URI
     */
    this.uri = uri;

    /**
     * @var {Array} methods upper case method name
     */
    this.methods = methods.map(method => method.toUpperCase());

    /**
     * @var {RegExp} regexp path RegExp
     */
    this.regexp = pathToRegExp(uri, this.keys);

    /**
     * @var {Controller} controller Controller
     */
    this.controller = controller;

    /**
     * @var {String} action controller action name
     */
    this.action = action;

    /**
     * @var {Middleware} middleware Middleware instance
     */
    this.middleware = new Middleware();

    /**
     * register Middlewares in Middleware instance
     */
    this.parseMiddleware();

    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes('GET') && !this.methods.includes('HEAD')) {
      this.methods.push('HEAD');
    }
  }

  parseMiddleware() {
    const middlewares = Meta.get('middlewares', this.controller.prototype) || [];
    const routeMiddlewares = Meta.get('route_middlewares', this.controller.prototype) || {};
    this.registerMiddlewares(middlewares);
    this.registerMiddlewares(routeMiddlewares[this.action]);
  }

  /**
   * get route params
   * @param {String} path request path
   */
  getParams(path) {
    return path.match(this.regexp).slice(1);
  }

  /**
   * get route controller
   */
  getController() {
    return this.controller;
  }

  /**
   * register Middlewares in Middleware instance
   */
  registerMiddlewares(middlewares) {
    if (!Array.isArray(middlewares)) return this;
    for (const middleware of middlewares) {
      this.middleware.register(middleware);
    }
    return this;
  }

  /**
   * check the path is matched this route
   * @param {String} path request path
   */
  match(path) {
    return this.regexp.test(path);
  }
}

module.exports = Route;
