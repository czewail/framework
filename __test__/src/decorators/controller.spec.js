require('../../../src/helpers');
const Controller = require('../../../src/decorators/controller');

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    const res = Controller('example')({
      kind: 'class',
      elements: [],
    }).finisher(class Example { });
    expect(Reflect.getMetadata('type', res.prototype)).toBe('controller');
    expect(Reflect.getMetadata('prefix', res.prototype)).toBe('/example');
  });
});
