/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { patchClass, patchProperty, patchMethod } = require('./patch-decorator');

function decorateClass(target, params, type) {
  return patchClass(type, params, target);
}

function decorateMethodAndProperty(target, name, descriptor, params, type) {
  if (Reflect.has(descriptor, 'value') && typeof descriptor.value === 'function') {
    patchMethod(type, params, target, name);
  }

  if (Reflect.has(descriptor, 'initializer') || Reflect.has(descriptor, 'get')) {
    patchProperty(type, params, target, name);
  }
  return descriptor;
}

function handle(args, params, type) {
  if (args.length === 1) {
    return decorateClass(...args, params, type);
  }
  return decorateMethodAndProperty(...args, params, type);
}

module.exports = function create(type) {
  return function (...args) {
    return handle(args, type);
  };
};
