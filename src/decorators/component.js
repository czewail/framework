/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { INJECT_ABLE } = require('../symbol');

function decoratorClass(target, name) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  if (!Reflect.hasMetadata('type', target.prototype)) {
    Reflect.defineMetadata('type', 'component', target.prototype);
  }
  Reflect.defineMetadata('name', name, target.prototype);
  return target;
}

function handle(args, name) {
  if (args.length === 1) {
    return decoratorClass(...args, name);
  }
  throw new Error('@Component must be decorate on Class');
}

module.exports = function Component(name = '') {
  return function (...args) {
    return handle(args, name);
  };
};
