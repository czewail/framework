const Container = require('../container');
const ResponseFactory = require('../response/manager');
const BaseController = require('../base/controller');
// const Pipeline = require('../pipeline');

class Dispatcher {
  constructor(route) {
    this.app = Container.get('app');
    this.route = route;
  }

  async resolve(request) {
    return this.route.middleware.handle(request, this.dispatchToController.bind(this));
  }

  async dispatchToController(request) {
    const controller = this.app.get(this.route.controller, [request], [request]);
    const proxyController = this.combineBaseController(request, controller);
    const { action } = this.route;
    const routeParams = this.route.getParams(request.path);
    const result = await proxyController[action](...routeParams);
    return (new ResponseFactory(result)).output(request);
  }

  combineBaseController(request, controller) {
    const baseController = new BaseController(request);
    return new Proxy(controller, {
      get(target, p, receiver) {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p, receiver);
        }
        return Reflect.get(baseController, p);
      },
    });
  }
}

module.exports = Dispatcher;
