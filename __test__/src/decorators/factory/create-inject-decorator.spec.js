require('reflect-metadata');
const create = require('../../../../src/decorators/factory/create-inject-decorator');
const symbols = require('../../../../src/symbol');

describe('Descrators/factory/create-inject-decorator', () => {
  describe('patchClass', () => {
    it('should patch injectable and types in constructor', () => {
      const Klass = @create('request')('a', 'b') class Example { constructor() { this.testname = ''; } };
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.CONSTRUCTOR, Klass.prototype)).toEqual([
        ['request', ['a', 'b']],
      ]);
    });
  });

  describe('patchProperty', () => {
    it('should patch injectable and types in property', () => {
      const Klass = class Example {
        @create('request')('a', 'b')
        testname = '';
      };
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.PROPERTY, Klass.prototype)).toEqual({
        testname: ['request', ['a', 'b']],
      });
    });
  });

  describe('patchMethod', () => {
    it('should patch injectable and types in method', () => {
      const Klass = class Example {
        @create('request')('a', 'b')
        index() {}
      };
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, Klass.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.METHOD, Klass.prototype)).toEqual({
        index: [
          ['request', ['a', 'b']],
        ],
      });
    });
  });
});
