const Route = require('./route')
const Collection = require('./collection')
const Container = require('../container')
const Meta = require('../foundation/support/meta')
const Dispatcher = require('./dispatcher')

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
  controllerCallbacks = [];

  /**
   * Create Router
   */
  constructor() {
    this.collection = new Collection()
    this.controllerCallbacks = this.getControllerCallbacks()
    this.registerRoutes()
  }

  getRouterMiddlewarePiper() {
    return ctx => {
      const request = this.app.call('request', [ctx])
      const metchedRoute = this.collection.match(request)
      const dispatcher = new Dispatcher(metchedRoute, ctx)
      return dispatcher.dispatch()
    }
  }

  registerRoutes() {
    for (const controller of this.controllerCallbacks) {
      this.parseController(controller)
    }
  }

  /**
   * parse controller
   * @param {Controller} controller
   */
  parseController(controller) {
    const routes = Meta.get('routes', controller.prototype) || []
    const prefix = Meta.get('prefix', controller.prototype) || ''
    const middlewares = Meta.get('middlewares', controller.prototype) || ''
    for (const route of routes) {
      this.register(`${prefix}${route.uri}`, [route.method], this.app.get(controller), route.action, middlewares)
    }
  }

  register(uri, methods, controllerCallback, controllerAction, middlewares) {
    const route = (new Route(uri, methods))
      .setControllerCallback(controllerCallback)
      .setControllerAction(controllerAction)
      .setMiddlewares(middlewares)
    this.collection.add(route)
  }

  getControllerCallbacks() {
    return this.app.tagged('controllerCallback')
  }
}

module.exports = Router
