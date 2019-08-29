require('../../../src/helpers');
const Component = require('../../../src/decorators/component');

describe('Component Decorator', () => {
  it('should patch type and name in Component', () => {
    const res = Component('example')(class Example { });
    expect(Reflect.getMetadata('type', res.prototype)).toBe('component');
    expect(Reflect.getMetadata('name', res.prototype)).toBe('example');
  });

  it('should throws error when decorate on method', () => {
    expect(() => class {
      @Component('example')
      foo() { }
    }).toThrow();
  });
});
