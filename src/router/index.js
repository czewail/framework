const parse = require('parseurl')
const Route = require('./route')
const Collection = require('./collection')
const Container = require('../container')
const Meta = require('../foundation/support/meta')
const Middlewareable = require('../foundation/ables/middlewareable')

class Router extends Middlewareable {
  app = Container.get('app');

  collection = null;

  controllerCallbacks = [];

  constructor() {
    super()
    this.collection = new Collection()
    this.controllerCallbacks = this.getControllerCallbacks()
    this.loadRoutes()
    console.log(this.collection.getMatchedRoutes('/', 'get'))
    // console.log(this.collection.routes)
  }

  loadRoutes() {
    for (const controller of this.controllerCallbacks) {
      const routes = Meta.get('routes', controller.prototype) || []
      const prefix = Meta.get('prefix', controller.prototype) || ''
      for (const route of routes) {
        this.add(`${prefix}${route.uri}`, [route.method], this.app.get(controller), route.action)
      }
    }
  }

  middleware(httpServer) {
    httpServer.use((req, res, next) => {
      console.log(222222)
      // const middleware = this.compose()
      // const dispatch = (_req, _res, _next) => _next(_req, _res)
      // return dispatch(req, res, middleware)
      next()
    })
  }

  add(uri, methods, controllerCallback, controllerAction) {
    const route = (new Route(uri, methods))
      .setControllerCallback(controllerCallback)
      .setControllerAction(controllerAction)
    this.collection.add(route)
  }

  getControllerCallbacks() {
    return this.app.tagged('controllerCallback')
  }
}

module.exports = Router
