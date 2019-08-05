/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const http = require('http');
const pathToRegExp = require('path-to-regexp');
const is = require('core-util-is');
const Container = require('../container');
const Middleware = require('../middleware');
const Response = require('../response');
const LoadSessionMiddleware = require('../session/middleware/load-session');

class Route {
  /**
   * Create Route
   * @param {String} uri route URI
   * @param {Array} methods route methods
   * @param {Controller | Function} handler controller
   * @param {String} action controller action
   * @param {Array} middlewares route middlewares
   */
  constructor(uri, methods = [], controller = null, action = '', middlewares = []) {
    this.app = Container.get('app');
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
    this.methods = this.parseMethods(methods);

    /**
     * @var {RegExp} regexp path RegExp
     */
    this.regexp = pathToRegExp(uri, this.keys);

    /**
     * @var {Controller | Function} controller controller
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
    // this.parseHandler();

    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes('GET') && !this.methods.includes('HEAD')) {
      this.methods.push('HEAD');
    }

    this.registerDefaultMiddlewares();

    this.registerControllerMiddlewares(middlewares);
  }

  /**
   * register default route middlewares
   */
  registerDefaultMiddlewares() {
    this.middleware.register(LoadSessionMiddleware);
  }

  /**
   * register route middleware
   * @param {Function} middleware
   */
  registerMiddleware(middleware) {
    if (middleware && is.isFunction(middleware)) {
      this.middleware.register(middleware);
    }
    return this;
  }

  addMethod(method) {
    const _method = method.toUpperCase();
    if (http.METHODS.includes(_method) && !this.methods.includes(_method)) {
      this.methods.push(_method);
    }
    return this;
  }


  parseMethods(methods = []) {
    const _methods = [];
    for (const method of methods) {
      const _method = method.toUpperCase();
      if (_method === 'ALL') {
        _methods.push.push(...http.METHODS);
      } else {
        _methods.push(_method);
      }
    }
    return [...new Set(_methods)];
  }


  // parseControllerMiddleware() {
  //   const middlewares = getMiddlewares(this.handler.prototype);
  //   const routeMiddlewares = getControllerRouteMiddlewares(this.handler.prototype);
  //   this.registerControllerMiddlewares(middlewares);
  //   this.registerControllerMiddlewares(routeMiddlewares[this.action]);
  // }

  /**
   * get route params
   * @param {String} path request path
   */
  getParams(path) {
    return path.match(this.regexp).slice(1);
  }

  // /**
  //  * get route controller
  //  */
  // getController() {
  //   return this.handler;
  // }

  /**
   * register Middlewares in Middleware instance
   */
  registerControllerMiddlewares(middlewares) {
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

  async resolve(request) {
    const controller = this.app.get(this.controller, [request]);
    const routeParams = this.getParams(request.path);
    const res = await controller[this.action](...routeParams);
    if (res instanceof Response) return res;
    return (new Response()).setData(res);
  }
}

module.exports = Route;
