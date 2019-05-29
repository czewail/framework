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
const { getControllerRouteMiddlewares, isController } = require('../controller/helpers');
const { getMiddlewares } = require('../middleware/helpers');
const BaseController = require('../base/controller');
const Response = require('../response');

class Route {
  /**
   * Create Route
   * @param {String} uri route URI
   * @param {Array} methods route methods
   * @param {Controller | Function} handler controller
   * @param {String} action controller action
   * @param {Array} middlewares route middlewares
   */
  constructor(uri, methods = [], handler = null, action = '') {
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
    this.methods = methods.map(method => method.toUpperCase());

    /**
     * @var {RegExp} regexp path RegExp
     */
    this.regexp = pathToRegExp(uri, this.keys);

    /**
     * @var {Controller | Function} handler handler
     */
    this.handler = handler;

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
    this.parseHandler();

    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes('GET') && !this.methods.includes('HEAD')) {
      this.methods.push('HEAD');
    }
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
    return methods.map(method => method.toUpperCase());
  }

  parseHandler() {
    // check if is controller
    if (this.handler && this.handler.prototype && isController(this.handler.prototype)) {
      this.parseControllerMiddleware();
    }
  }

  parseControllerMiddleware() {
    const middlewares = getMiddlewares(this.handler.prototype);
    const routeMiddlewares = getControllerRouteMiddlewares(this.handler.prototype);
    this.registerControllerMiddlewares(middlewares);
    this.registerControllerMiddlewares(routeMiddlewares[this.action]);
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
    return this.handler;
  }

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
    if (this.handler && this.handler.prototype && isController(this.handler.prototype)) {
      const controller = this.app.get(this.handler, [request]);
      const proxyController = this.combineBaseController(controller);
      const routeParams = this.getParams(request.path);
      const res = await proxyController[this.action](...routeParams);
      if (res instanceof Response) return res;
      return (new Response()).setData(res);
    }
    return this.handler(request);
  }

  combineBaseController(controller) {
    const baseController = new BaseController(this.request);
    return new Proxy(controller, {
      get(target, p, receiver) {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p, receiver);
        }
        return Reflect.get(baseController, p);
      },
    });
  }
}

module.exports = Route;
