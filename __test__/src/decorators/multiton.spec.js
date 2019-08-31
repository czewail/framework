require('reflect-metadata');
const Multiton = require('../../../src/decorators/multiton');
const { MULTITON } = require('../../../src/symbol');

describe('Multiton Decorator', () => {
  it('should patch Multiton flag in Multiton', () => {
    const res = Multiton('example')(class Example { });
    expect(res[MULTITON]).toBeTruthy();
  });

  it('should throws error when decorate on method', () => {
    expect(() => class {
      @Multiton()
      foo() { }
    }).toThrow();
  });
});
