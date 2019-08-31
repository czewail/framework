/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decoratorClass(target, middleware) {
  const middlewares = Reflect.getMetadata('controllerMiddlewares', target.prototype) || [];
  middlewares.push(middleware);
  Reflect.defineMetadata('controllerMiddlewares', middlewares, target.prototype);
  return target;
}

function decoratorMethod(target, name, descriptor, middleware) {
  const middlewares = Reflect.getMetadata('routeMiddlewares', target) || {};
  if (!middlewares[name]) {
    middlewares[name] = [];
  }
  middlewares[name].push(middleware);
  Reflect.defineMetadata('routeMiddlewares', middlewares, target);
  return target;
}

function handle(args, middleware) {
  if (args.length === 1) {
    return decoratorClass(...args, middleware);
  }
  return decoratorMethod(...args, middleware);
}

module.exports = function useMiddleware(middleware) {
  return (...args) => handle(args, middleware);
};
