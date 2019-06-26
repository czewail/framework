
require('../../../src/helpers');
const path = require('path');
const Validate = require('../../../src/validate');
const validators = require('../../../src/validate/validators');
const Application = require('../../../src/foundation/application');

const app = new Application(path.resolve(__dirname, '../../'));
app.initialize();

describe('Validate', () => {
  describe('Validate#rules', () => {
    it('should return structuring object array when rules is struct object', () => {
      const struct = {
        field: [
          ['isEmail', [], { message: '$field must be email' }],
        ],
      };
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, struct);

      expect(instance.rules).toEqual([
        {
          field: 'field',
          handler: validators.isEmail,
          args: [],
          options: {
            message: '$field must be email',
          },
        },
      ]);
    });

    it('should return structuring object array when rules is Validator instance', () => {
      const Validator = class {};
      Reflect.setMetadata('type', 'validator', Validator.prototype);
      Reflect.setMetadata('validator', [
        {
          field: 'field',
          handler: validators.isEmail,
          args: [],
          options: {
            message: '$field must be email',
          },
        },
      ], Validator.prototype);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, new Validator());
      expect(instance.rules).toEqual([{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be email',
        },
      }]);
    });

    it('should return structuring object array when rules is string', () => {
      const Validator = class {};
      Reflect.setMetadata('type', 'validator', Validator.prototype);
      Reflect.setMetadata('validator', [{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be email',
        },
      }], Validator.prototype);
      app.bind('validator.example', Validator);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example');
      expect(instance.rules).toEqual([{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be email',
        },
      }]);
    });

    it('should return empty array when rules is empty stuct object', () => {
      const struct = {};
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, struct);

      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is Validator instance without rules', () => {
      const Validator = class {};
      Reflect.setMetadata('type', 'validator', Validator.prototype);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, new Validator());
      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is conatiner instance without rules', () => {
      const Validator = class {};
      Reflect.setMetadata('type', 'validator', Validator.prototype);
      app.bind('validator.example2', Validator);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example2');
      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is err type', () => {
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 111);
      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is a not bind conatiner instance string', () => {
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example3');
      expect(instance.rules).toEqual([]);
    });
  });

  describe('Validate#replaceSpecialMessageFields', () => {
    it('should replace predefine field with string', () => {
      const instance = new Validate();
      const rule = {
        field: 'username',
        handler: validators.isEmail,
        args: [10, 20],
        options: {
          message: '$field: $value must be between $1 and $2',
        },
      };
      expect(instance.replaceSpecialMessageFields(100, rule)).toBe('username: 100 must be between 10 and 20');
    });
  });
});
