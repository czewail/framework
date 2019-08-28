require('../../../src/helpers');
const Validator = require('../../../src/decorators/validator.stage-2');

describe('Validator Decorator', () => {
  it('should patch type and validatorName in Validator', () => {
    const Klass = @Validator('example') class Example { };
    expect(Reflect.getMetadata('type', Klass.prototype)).toBe('validator');
    expect(Reflect.getMetadata('name', Klass.prototype)).toBe('example');
  });
});
