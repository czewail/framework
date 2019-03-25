const Route = require('./route');
const Collection = require('./collection');
const Container = require('../container');
const Meta = require('../foundation/support/meta');
const Dispatcher = require('./dispatcher');

class Router {
  /**
   * @var {Application} app Application instance
   */
  app = Container.get('app');

  /**
   * @var {Collection} collection Router Collection instance
   */
  collection = null;

  /**
   * @var {Array<controllerCallback>} controllerCallbacks controller callback in container
   * controllerCallback:
   * (ctx) => {
   *  // ...
   *  return new Controller()
   * }
   */
  controllers = [];

  /**
   * Create Router
   */
  constructor() {
    this.collection = new Collection();
    this.controllers = this.getControllers();
    this.registerRoutes();
  }

  getRouterMiddlewarePiper() {
    return (ctx) => {
      const request = this.app.get('request', [ctx], true);
      const metchedRoute = this.collection.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute, ctx);
      return dispatcher.dispatch();
    };
  }

  registerRoutes() {
    for (const controller of this.controllers) {
      this.parseController(controller);
    }
  }

  /**
   * parse controller
   * @param {Controller} controller
   */
  parseController(controller) {
    const routes = Meta.get('routes', controller.prototype) || [];
    const prefix = Meta.get('prefix', controller.prototype) || '';
    const middlewares = Meta.get('middlewares', controller.prototype) || '';
    for (const route of routes) {
      this.register(`${prefix}${route.uri}`, [route.method], controller, route.action, middlewares);
    }
  }

  register(uri, methods, controller, controllerAction, middlewares) {
    const route = (new Route(uri, methods))
      .setController(controller)
      .setControllerAction(controllerAction)
      .setMiddlewares(middlewares);
    this.collection.add(route);
  }

  getControllers() {
    return this.app.tagged('controller');
  }
}

module.exports = Router;
