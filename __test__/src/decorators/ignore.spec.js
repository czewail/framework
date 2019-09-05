require('reflect-metadata');
const Ignore = require('../../../src/decorators/ignore');

describe('Ignore Decorator', () => {
  it('should patch Ignore by @Ignore', () => {
    @Ignore()
    class Example { }
    expect(Reflect.getMetadata('ignore', Example.prototype)).toBeTruthy();
  });

  it('should throws decorate method by @Ignore', () => {
    expect(() => class Example {
      @Ignore()
      index() { }
    }).toThrowError();
  });
});
