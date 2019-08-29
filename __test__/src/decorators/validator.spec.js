require('../../../src/helpers');
const Validator = require('../../../src/decorators/validator');

describe('Validator Decorator', () => {
  it('should patch type and name in Validator', () => {
    const Klass = @Validator('example') class Example { };
    expect(Reflect.getMetadata('type', Klass.prototype)).toBe('validator');
    expect(Reflect.getMetadata('name', Klass.prototype)).toBe('example');
  });
});
