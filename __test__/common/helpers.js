
require('reflect-metadata');
const Controller = require('../../src/base/controller');

exports.createController = function () {
  class _Controller extends Controller {
    get hello() {
      return 'hello';
    }

    index() { }

    show() { }

    create() { }

    stroe() { }

    edit() { }

    update() { }

    destory() { }
  }

  Reflect.defineMetadata('type', 'controller', _Controller.prototype);

  return _Controller;
};

exports.createService = function () {
  const target = class {};
  Reflect.defineMetadata('type', 'service', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};

exports.createResource = function () {
  const target = class { };
  Reflect.defineMetadata('type', 'resource', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};

exports.createComponent = function () {
  const target = class { };
  Reflect.defineMetadata('type', 'component', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};
