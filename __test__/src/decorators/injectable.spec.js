require('reflect-metadata');
const Injectable = require('../../../src/decorators/injectable');
const symbols = require('../../../src/symbol');

describe('Injectable Decorator', () => {
  it('should patch Injectable by @Injectable', () => {
    @Injectable()
    class Example { }
    expect(Reflect.getMetadata(symbols.INJECT_ABLE, Example.prototype)).toBeTruthy();
  });

  it('should throws decorate method by @Injectable', () => {
    expect(() => class Example {
      @Injectable()
      index() { }
    }).toThrowError();
  });
});
