

/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { letMiddleware } = require('../middleware/helpers');

function injectClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      letMiddleware(target.prototype);
      return target;
    },
  };
  // if (Reflect.has(target.prototype, 'resolve')
  // && typeof target.prototype.resolve === 'function') {
  //   Meta.set('isMiddleware', true, target.prototype);
  //   return target;
  // }
  // throw new TypeError(`[${target.name || 'middleware'}] must implement the resolve method`);
}

function handle(elementDescriptor) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor);
  }
  throw new TypeError('@Middleware must use on class');
}

module.exports = function Middleware() {
  return elementDescriptor => handle(elementDescriptor);
};
