const path = require('path');
const is = require('core-util-is');
const Container = require('../container');
const Meta = require('../foundation/support/meta');
// const ResponseFactory = require('../response/manager');
// const BaseController = require('../base/controller');


class Controller {
  constructor() {
    this.app = Container.get('app');

    this.controllers = [];
  }

  register(controller) {
    if (is.isString(controller)) {
      this.parseStringController(controller);
    } else if (is.isFunction(controller)) {
      this.parseFunctionController(controller);
    }
  }

  parseStringController(controller) {
    const controllerPatth = require.resolve(path.join(this.app.controllerPath, controller));
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const controllerRequired = require(controllerPatth);
    this.parseFunctionMiddleware(controllerRequired);
  }

  parseFunctionController(controller) {
    if (!is.isFunction(controller)) return this;
    // 使用了 @Controller 装饰器
    if (controller.prototype && Meta.has('isController', controller.prototype) && Meta.get('isController', controller.prototype) === true) {
      this.app.multiton(controller, controller);
      this.controllers.push(controller);
    }
    return this;
  }

  // getControllerDispatcher() {
  //   return async (request) => {
  //     const controller = this.app.get(this.route.controller, [request], [request]);
  //     const proxyController = this.combineBaseController(request, controller);
  //     const { action } = this.route;
  //     const routeParams = this.route.getParams(request.path);
  //     const result = await proxyController[action](...routeParams);
  //     return (new ResponseFactory(result)).output(request);
  //   };
  // }

  // combineBaseController(request, controller) {
  //   const baseController = new BaseController(request);
  //   return new Proxy(controller, {
  //     get(target, p, receiver) {
  //       if (p !== 'constructor' && Reflect.has(baseController, p)) {
  //         return baseController[p];
  //       }
  //       return Reflect.get(target, p, receiver);
  //     },
  //   });
  // }
}

module.exports = Controller;
