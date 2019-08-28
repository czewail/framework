/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decoratorClass(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = Reflect.getMetadata('controllerMiddlewares', target.prototype) || [];
      middlewares.push(middleware);
      Reflect.setMetadata('controllerMiddlewares', middlewares, target.prototype);
      return target;
    },
  };
}

function decoratorMethod(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = Reflect.getMetadata('routeMiddlewares', target.prototype) || {};
      if (!middlewares[elementDescriptor.key]) {
        middlewares[elementDescriptor.key] = [];
      }
      middlewares[elementDescriptor.key].push(middleware);
      Reflect.setMetadata('routeMiddlewares', middlewares, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, middleware) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return decoratorClass(elementDescriptor, middleware);
  }
  if (kind === 'method') {
    return decoratorMethod(elementDescriptor, middleware);
  }
  throw new TypeError('@useMiddleware must use on class or method!');
}

module.exports = function useMiddleware(middleware) {
  return elementDescriptor => handle(elementDescriptor, middleware);
};
