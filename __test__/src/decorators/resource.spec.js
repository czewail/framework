require('../../../src/helpers');
const Resource = require('../../../src/decorators/resource');

describe('Resource Decorator', () => {
  it('should patch type and name in Resource', () => {
    const Klass = @Resource('example') class Example { };
    expect(Reflect.getMetadata('type', Klass.prototype)).toBe('resource');
    expect(Reflect.getMetadata('name', Klass.prototype)).toBe('example');
  });
});
