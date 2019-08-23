
require('../../src/helpers');

exports.createController = function () {
  const newController = class Controller {
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
  };

  Reflect.setMetadata('type', 'controller', newController.prototype);

  return newController;
};

exports.createService = function () {
  const target = class {};
  Reflect.setMetadata('type', 'service', target.prototype);
  Reflect.setMetadata('name', 'user', target.prototype);
  return target;
};

exports.createResource = function () {
  const target = class { };
  Reflect.setMetadata('type', 'resource', target.prototype);
  Reflect.setMetadata('name', 'user', target.prototype);
  return target;
};

exports.createComponent = function () {
  const target = class { };
  Reflect.setMetadata('type', 'component', target.prototype);
  Reflect.setMetadata('name', 'user', target.prototype);
  return target;
};
