

/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Meta = require('../foundation/support/meta');

function injectClass(target) {
  if (Reflect.has(target.prototype, 'resolve') && typeof target.prototype.resolve === 'function') {
    Meta.set('isMiddleware', true, target.prototype);
    return target;
  }
  throw new TypeError(`[${target.name || 'middleware'}] must implement the resolve method`);
}

function handle(args, middlewares) {
  if (args.length === 1) {
    return injectClass(...args, middlewares);
  }
  throw new TypeError('@Middleware must use on class');
}

module.exports = function Middleware(...middlewares) {
  return (...argsClass) => handle(argsClass, middlewares);
};
