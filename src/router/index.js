const http = require('http');
const Route = require('./route');
const Collection = require('./collection');
const Container = require('../container');
const Dispatcher = require('./dispatcher');
const corsMiddleware = require('../foundation/middlewares/cors');
const ResponseFactory = require('../response/manager');


class Router {
  /**
   * Create Router
   */
  constructor() {
    /**
     * @var {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Collection} collection Router Collection instance
     */
    this.collection = new Collection();

    /**
     * @var {Controller[]} controllers controllers in container
     */
    // this.controllers = this.getControllers();

    // this.registerRoutes();
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
    const corses = Reflect.getMetadata('crossOrigin', controller.prototype) || {};
    if (corses[action]) {
      route.addMethod('OPTIONS').registerMiddleware(corsMiddleware);
    }
    this.collection.add(route);
    return route;
  }
}

module.exports = Router;
