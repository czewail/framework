/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
// const Meta = require('../foundation/support/meta');
const Middleware = require('../middleware');
const Metadata = require('../foundation/support/metadata');

function injectClass(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      // -------------- new -----------
      if (!Metadata.has('middleware', target.prototype)) {
        Metadata.set('middleware', new Middleware(), target.prototype);
      }
      const _Middleware = Metadata.get('middleware', target.prototype);

      _Middleware.register(middleware);

      // // -------------- old -----------
      // const middlewares = getMiddlewares(target.prototype);
      // (target.prototype, [
      //   ...middlewares,
      //   middleware,
      // ]);
      return target;
    },
  };
}

function injectMethod(elementDescriptor, middleware) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const middlewares = Reflect.getMetadata('routeMiddlewares', target.prototype);
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
    return injectClass(elementDescriptor, middleware);
  }
  return injectMethod(elementDescriptor, middleware);
}

module.exports = function useMiddleware(middleware) {
  return elementDescriptor => handle(elementDescriptor, middleware);
};
