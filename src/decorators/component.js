/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decoratorClass(target, name) {
  Reflect.setMetadata('type', 'component', target.prototype);
  Reflect.setMetadata('name', name, target.prototype);
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
