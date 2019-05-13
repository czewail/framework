/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
// const Meta = require('../foundation/support/meta');
const {
  getControllerMiddlewares, setControllerMiddlewares,
  getControllerRouteMiddlewares, setControllerRouteMiddlewares,
} = require('../utils');

function injectClass(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = getControllerMiddlewares(target.prototype);
      setControllerMiddlewares(target.prototype, [
        ...middlewares,
        middleware,
      ]);
      return target;
    },
  };
  // const middlewares = Meta.get('middlewares', target.prototype) || [];
  // Meta.set('middlewares', [...middlewares, middleware], target.prototype);
  // return target;
}

function injectMethod(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = getControllerRouteMiddlewares(target.prototype);
      if (!middlewares[elementDescriptor.key]) {
        middlewares[elementDescriptor.key] = [];
      }
      middlewares[elementDescriptor.key].push(middleware);
      setControllerRouteMiddlewares(target.prototype, middlewares);
      return target;
    },
  };
  // const routeMiddlewares = Meta.get('route_middlewares', target) || {};
  // if (!routeMiddlewares[name]) {
  //   routeMiddlewares[name] = [];
  // }
  // routeMiddlewares[name].push(middleware);
  // Meta.set('route_middlewares', routeMiddlewares, target);
  // return descriptor;
}

function handle(elementDescriptor, middleware) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor, middleware);
  }
  return injectMethod(elementDescriptor, middleware);
}

module.exports = function useMiddleware(middleware) {
  return elementDescriptor => handle(elementDescriptor, middleware);
};
