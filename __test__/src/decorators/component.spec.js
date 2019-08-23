require('../../../src/helpers');
const Component = require('../../../src/decorators/component');

describe('Component Decorator', () => {
  it('should patch type and name in Component', () => {
    const res = Component('example')({
      kind: 'class',
      elements: [],
    }).finisher(class Example {});
    expect(Reflect.getMetadata('type', res.prototype)).toBe('component');
    expect(Reflect.getMetadata('name', res.prototype)).toBe('example');
  });
});
