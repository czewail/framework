/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
// const Meta = require('../foundation/support/meta');
const {
  getControllerRouteMiddlewares, setControllerRouteMiddlewares,
} = require('../controller/helpers');
const { getMiddlewares, setMiddlewares } = require('../middleware/helpers');

function injectClass(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = getMiddlewares(target.prototype);
      setMiddlewares(target.prototype, [
        ...middlewares,
        middleware,
      ]);
      return target;
    },
  };
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
