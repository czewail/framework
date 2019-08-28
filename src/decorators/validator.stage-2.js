/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const proxy = require('../base/proxy');
const BaseValidator = require('../base/validator');

function decoratorClass(target, name) {
  Reflect.setMetadata('type', 'validator', target.prototype);
  Reflect.setMetadata('name', name, target.prototype);
  return proxy(target, BaseValidator);
}

function handle(args, name) {
  if (args.length === 1) {
    return decoratorClass(...args, name);
  }
  throw new Error('@Validator must be decorate on Class');
}

module.exports = function Validator(name = '') {
  return (...args) => handle(args, name);
};
