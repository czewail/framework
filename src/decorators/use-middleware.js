/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Meta = require('../foundation/support/meta');

function injectClass(target, middleware) {
  const middlewares = Meta.get('middlewares', target.prototype) || [];
  Meta.set('middlewares', [...middlewares, middleware], target.prototype);
  return target;
}

function injectMethod(target, name, descriptor, middleware) {
  const routeMiddlewares = Meta.get('route_middlewares', target) || {};
  if (!routeMiddlewares[name]) {
    routeMiddlewares[name] = [];
  }
  routeMiddlewares[name].push(middleware);
  Meta.set('route_middlewares', routeMiddlewares, target);
  return descriptor;
}

function handle(args, middleware) {
  if (args.length === 1) {
    return injectClass(...args, middleware);
  }
  return injectMethod(...args, middleware);
}

module.exports = function useMiddleware(middleware) {
  return (...argsClass) => handle(argsClass, middleware);
};
