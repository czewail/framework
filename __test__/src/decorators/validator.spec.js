require('../../../src/helpers');
const Validator = require('../../../src/decorators/validator');

describe('Validator Decorator', () => {
  it('should patch type and validatorName in Validator', () => {
    const res = Validator('example')({
      kind: 'class',
      elements: [],
    }).finisher(class Example { });
    expect(Reflect.getMetadata('type', res.prototype)).toBe('validator');
    expect(Reflect.getMetadata('name', res.prototype)).toBe('example');
  });
});
