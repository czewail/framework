const path = require('path');
const is = require('core-util-is');
const Container = require('../container');
const { isController } = require('../controller/helpers');

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
    if (isController(controller.prototype)) {
      this.app.multiton(controller, controller);
      this.controllers.push(controller);
    }
    return this;
  }
}

module.exports = Controller;
