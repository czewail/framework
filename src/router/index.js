/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Route = require('./route');
const Collection = require('./collection');
const Container = require('../container');
const Dispatcher = require('./dispatcher');
const corsMiddleware = require('../foundation/middlewares/cors');

class Router {
  /**
   * Create Router
   */
  constructor() {
    /**
     * @type {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @type {RouteCollection} collection Router Collection instance
     */
    this.collection = new Collection();
  }

  resolve() {
    return async (request) => {
      const metchedRoute = this.collection.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute);
      return dispatcher.resolve();
      // return new ResponseFactory(res).output(request);
    };
  }

  register(uri, methods, controller, action, middlewares) {
    if (Reflect.getMetadata('type', controller.prototype) !== 'controller') throw new Error('route must be register an controller!');
    const route = new Route(uri, methods, controller, action, middlewares);
    const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller.prototype);
    const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller.prototype) || {};

    if (controllerCrossOrigin) {
      route.addMethod('OPTIONS').registerMiddleware(corsMiddleware, [controllerCrossOrigin]);
    } else if (routeCrossOrigin[action]) {
      route.addMethod('OPTIONS').registerMiddleware(corsMiddleware, [routeCrossOrigin[action]]);
    }
    this.collection.add(route);
    return route;
  }
}

module.exports = Router;
