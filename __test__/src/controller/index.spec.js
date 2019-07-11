const path = require('path');
require('../../../src/helpers');
const { createController } = require('../../common/helpers');
const Controller = require('../../../src/controller');
const Application = require('../../../src/foundation/application');

const app = new Application(path.resolve(__dirname, '../../daze/src'));
app.initialize();

describe('Controller', () => {
  it('Controller#register', () => {
    const controller = createController();
    const instance = new Controller();
    instance.register(controller);
    expect(app.get(controller)).toBeInstanceOf(controller);
    expect(() => {
      instance.register('string');
    }).toThrow();
    expect(() => {
      instance.register(class {});
    }).toThrow();
  });
});
