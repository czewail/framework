const Route = require('./route');
const Collection = require('./collection');
const Container = require('../container');
const Dispatcher = require('./dispatcher');
const { getControllerPrefix, getControllerRoutes } = require('../utils');


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
    this.controllers = this.getControllers();

    this.registerRoutes();
  }

  getRouterPipe() {
    return async (request) => {
      const metchedRoute = this.collection.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute);
      return dispatcher.resolve();
      // return this.getStaticServerPipe(request);
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
    const routes = getControllerRoutes(controller.prototype);
    const prefix = getControllerPrefix(controller.prototype);
    for (const key of Object.keys(routes)) {
      const route = routes[key];
      this.register(`${prefix}${route.uri}`, [route.method], controller, key);
    }
  }

  register(uri, methods, controller, action, middlewares) {
    const route = new Route(uri, methods, controller, action, middlewares);
    this.collection.add(route);
  }

  getControllers() {
    // return this.app.tagged('controller');
    return this.app.get('controller').controllers || [];
  }
}

module.exports = Router;
