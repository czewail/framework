const Container = require('../container');
const ResponseFactory = require('../response/manager');
// const Pipeline = require('../pipeline');

class Dispatcher {
  constructor(route) {
    this.app = Container.get('app');
    this.route = route;
  }

  resolve(request) {
    return this.route.middleware.handle(request, this.dispatchToController.bind(this));
  }

  dispatchToController(request) {
    const controller = this.app.get(this.route.controller, [request]);
    const { action } = this.route;
    const routeParams = this.route.getParams(request.path);
    const result = controller[action](...routeParams);
    return (new ResponseFactory(result)).output(request);
  }
}

module.exports = Dispatcher;
