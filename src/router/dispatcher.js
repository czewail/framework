const Container = require('../container')
const ResponseFactory = require('../response/manager')

class Dispatcher {
  constructor(route, ctx) {
    this.app = Container.get('app')
    this.route = route
    this.ctx = ctx
    this.request = this.app.call('request', [ctx])
  }

  dispatch() {
    const controller = this.route.controllerCallback(this.ctx)
    const action = this.route.controllerAction
    const routeParams = this.route.getParams(this.request.path)
    const result = controller[action](...routeParams)
    return (new ResponseFactory(result)).output(this.ctx)
  }
}

module.exports = Dispatcher
