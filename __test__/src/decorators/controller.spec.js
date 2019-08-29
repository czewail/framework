require('../../../src/helpers');
const Controller = require('../../../src/decorators/controller');

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    const res = Controller('example')(class Example { });
    expect(Reflect.getMetadata('type', res.prototype)).toBe('controller');
    expect(Reflect.getMetadata('prefix', res.prototype)).toBe('/example');
  });

  it('should throws error when decorate on method', () => {
    expect(() => class {
      @Controller('example')
      foo() { }
    }).toThrow();
  });
});
