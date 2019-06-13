
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

  return newController;
};
