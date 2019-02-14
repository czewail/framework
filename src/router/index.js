
const Route = require('./route')
const Collection = require('./collection')

class Router {
  collection = null;

  constructor() {
    this.collection = new Collection()
  }

  add(uri, methods, controller, controllerMethod) {
    // const route = (new Route(uri, methods))
    //   .setController(controller)
    //   .setControllerMethod(controllerMethod)
  }
}

module.exports = Router
