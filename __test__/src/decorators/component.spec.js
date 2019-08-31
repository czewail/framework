require('reflect-metadata');
const Component = require('../../../src/decorators/component');
const symbols = require('../../../src/symbol');

describe('Component Decorator', () => {
  it('should patch injectable and name in Component', () => {
    const res = @Component('example') class Example { };
    expect(Reflect.getMetadata(symbols.INJECT_ABLE, res.prototype)).toBeTruthy();
    expect(Reflect.getMetadata('name', res.prototype)).toBe('example');
  });

  it('should throws error when decorate on method', () => {
    expect(() => class {
      @Component('example')
      foo() { }
    }).toThrow();
  });
});
