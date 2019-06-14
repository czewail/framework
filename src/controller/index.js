const path = require('path');
const is = require('core-util-is');
const Container = require('../container');

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
    this.parseFunctionController(controllerRequired);
  }

  parseFunctionController(controller) {
    if (!is.isFunction(controller)) return this;
    // 使用了 @Controller 装饰器
    if (Reflect.hasMetadata('isController', controller.prototype)) {
      this.app.multiton(controller, controller);
      this.resolve(controller);
    }
    return this;
  }

  resolve(controller) {
    const routes = Reflect.getMetadata('routes', controller.prototype);
    const prefix = Reflect.getMetadata('prefix', controller.prototype);

    const Router = this.app.get('router');
    for (const key of Object.keys(routes)) {
      const { uri, method } = routes[key];
      Router.register(`${prefix}${uri}`, [method], controller, key);
    }
  }
}

module.exports = Controller;
