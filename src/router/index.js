/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Route = require('./route');
const Trie = require('./trie');
const Container = require('../container');
const Dispatcher = require('./dispatcher');
const { Cors } = require('../foundation/middlewares');

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
     * @type {trie} Router trie instance
     */
    this.trie = new Trie();
  }

  resolve() {
    return async (request) => {
      // const metchedRoute = this.collection.match(request);
      const metchedRoute = this.trie.match(request);

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
      route.addMethod('OPTIONS').registerMiddleware(Cors, [controllerCrossOrigin]);
    } else if (routeCrossOrigin[action]) {
      route.addMethod('OPTIONS').registerMiddleware(Cors, [routeCrossOrigin[action]]);
    }
    this.trie.add(route);
    return route;
  }
}

module.exports = Router;
