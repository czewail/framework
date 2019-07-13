require('../../../../src/helpers');
const create = require('../../../../src/decorators/factory/create-inject-decorator');
const symbols = require('../../../../src/symbol');

describe('Descrators/factory/create-inject-decorator', () => {
  describe('patchClass', () => {
    it('should patch injectable and types in constructor', () => {
      const res = create('request')('a', 'b')({
        kind: 'class',
        elements: [],
      }).finisher(class Example { });
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, res.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.CONSTRUCTOR, res.prototype)).toEqual([
        ['request', ['a', 'b']],
      ]);
    });
  });

  describe('patchProperty', () => {
    it('should patch injectable and types in property', () => {
      const res = create('request')('a', 'b')({
        kind: 'field',
        key: 'testname',
        elements: [],
      }).finisher(class Example { });
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, res.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.PROPERTY, res.prototype)).toEqual({
        testname: ['request', ['a', 'b']],
      });
    });
  });

  describe('patchMethod', () => {
    it('should patch injectable and types in method', () => {
      const res = create('request')('a', 'b')({
        kind: 'method',
        key: 'index',
        elements: [],
      }).finisher(class Example { });
      expect(Reflect.getMetadata(symbols.INJECT_ABLE, res.prototype)).toBeTruthy();
      expect(Reflect.getMetadata(symbols.INJECTABLE_KINDS.METHOD, res.prototype)).toEqual({
        index: [
          ['request', ['a', 'b']],
        ],
      });
    });
  });
});
