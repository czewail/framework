/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const is = require('core-util-is');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Controller {
  /**
   * Create Controller Module
   */
  constructor() {
    /**
     * @var {object} app Application
     */
    this.app = Container.get('app');
  }

  /**
   * register a controller
   * @param {Class} controller controller class
   * @return {Controller} this
   * @public
   */
  register(controller) {
    if (!is.isFunction(controller)) throw new IllegalArgumentError('controller must be a class!');
    this.parseController(controller);
    return this;
  }

  /**
   * parse a controller
   * @param {Class} controller ontroller class
   * @return {Controller} this
   * @private
   */
  parseController(controller) {
    if (Reflect.getMetadata('type', controller.prototype) !== 'controller') throw new IllegalArgumentError('controller class must use @Controller decorator!');
    this.app.multiton(controller, controller);
    this.resolve(controller);
    return this;
  }

  /**
   * resolve this controller
   * @param {Class} controller controller class
   * @private
   */
  resolve(controller) {
    const routes = Reflect.getMetadata('routes', controller.prototype) || {};
    const prefix = Reflect.getMetadata('prefix', controller.prototype) || '';
    const controllerMiddlewares = Reflect.getMetadata('controllerMiddlewares', controller.prototype) || [];
    const routeMiddlewares = Reflect.getMetadata('routeMiddlewares', controller.prototype) || {};
    this.registerRoutes(controller, routes, prefix, controllerMiddlewares, routeMiddlewares);
  }

  /**
   * register controller routes
   * @param {Class} controller controller class
   * @param {Array} routes routes desc array
   * @param {String} prefix routes prefix
   * @param {Middleware} controllerMiddlewares controller middlewares
   * @param {Middleware} routeMiddlewares route middlewares
   * @private
   */
  registerRoutes(controller, routes, prefix, controllerMiddlewares, routeMiddlewares) {
    const Router = this.app.get('router');
    for (const key of Object.keys(routes)) {
      for (const route of routes[key]) {
        const { uri, method } = route;
        const actionMiddlewares = routeMiddlewares[key] || [];
        Router.register(`${prefix}${uri}`, [method], controller, key, [...controllerMiddlewares, ...actionMiddlewares]);
      }
    }
  }
}

module.exports = Controller;
