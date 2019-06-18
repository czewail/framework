const path = require('path');
require('../../../src/helpers');
const { createComponent } = require('../../common/helpers');
const Component = require('../../../src/component');
const Application = require('../../../src/foundation/application');

const app = new Application(path.resolve(__dirname, '../../'));
app.initialize();

describe('Component', () => {
  it('Component#register', () => {
    const component = createComponent();
    const instance = new Component();
    instance.register(component);
    expect(app.get('component.user')).toBeInstanceOf(component);
    expect(() => {
      instance.register('string');
    }).toThrow();
    expect(() => {
      instance.register(class { });
    }).toThrow();
  });
});
