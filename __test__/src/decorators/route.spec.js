require('reflect-metadata');
const Route = require('../../../src/decorators/route');

describe('Controller Decorator', () => {
  it('should patch type and prefix in Controller', () => {
    const res = @Route('example') class Example { };
    expect(Reflect.getMetadata('prefix', res.prototype)).toBe('/example');
  });

  it('should throws error when decorate on method', () => {
    expect(() => class {
      @Route('example')
      foo() { }
    }).toThrow();
  });
});
