const http = require('http');
const Route = require('./route');
const Collection = require('./collection');
const Container = require('../container');
const Dispatcher = require('./dispatcher');
const { getControllerPrefix, getControllerRoutes, getControllerCrossOrigin } = require('../controller/helpers');
const corsMiddleware = require('../foundation/middlewares/cors');


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

  resolve() {
    return async (request) => {
      const metchedRoute = this.collection.match(request);
      const dispatcher = new Dispatcher(request, metchedRoute);
      const res = await dispatcher.resolve();
      return res;
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
    const corses = getControllerCrossOrigin(controller.prototype);
    for (const key of Object.keys(routes)) {
      const { uri, method } = routes[key];
      // // 当前控制器方法需要加载 cors
      // if (corses[key]) {
      //   this.register(`${prefix}${route.uri}`, ['OPTIONS'], handlers.cors);
      // }
      const route = this.register(`${prefix}${uri}`, this.getSuportMethods(method), controller, key);

      if (corses[key]) {
        route.addMethod('OPTIONS').registerMiddleware(corsMiddleware);
      }
      this.collection.add(route);
    }
  }


  getSuportMethods(inputMethod = '') {
    return inputMethod.toUpperCase() === 'ALL' ? http.METHODS : [inputMethod];
  }

  register(uri, methods, controller, action, middlewares) {
    const route = new Route(uri, methods, controller, action, middlewares);
    return route;
  }

  getControllers() {
    // return this.app.tagged('controller');
    return this.app.get('controller').controllers || [];
  }
}

module.exports = Router;
