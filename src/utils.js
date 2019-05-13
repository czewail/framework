/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const symbols = require('./symbol');

/**
 * defer function based on promise
 * 基于 promise 的延迟函数
 */
exports.defer = function defer() {
  const result = {};
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

/**
 * Determine whether the target can be traversed
 */
exports.iterable = function iterable(target) {
  return !!target[Symbol.iterator];
};

// /**
//  * Checks if the class method exists
//  */
// exports.method_exists = function methodExists(obj, name) {
//   return Reflect.has(obj, name) && typeof Reflect.get(obj, name) === 'function';
// };

// /**
//  * Checks if the object or class has a property
//  */
// exports.property_exists = function propertyExists(obj, name) {
//   return Reflect.has(obj, name) && typeof Reflect.get(obj, name) !== 'function';
// };

exports.isModule = function (target) {
  return target && target[symbols.CHECKERS.MODULE] === true;
};

exports.letModule = function (target) {
  if (target) {
    target[symbols.CHECKERS.MODULE] = true;
  }
};

exports.isController = function (target) {
  return target && target[symbols.CHECKERS.CONTROLLER] === true;
};

exports.letController = function (target) {
  if (target) {
    target[symbols.CHECKERS.CONTROLLER] = true;
  }
};

exports.isMiddleware = function (target) {
  return target && target[symbols.CHECKERS.MIDDLEWARE] === true;
};

exports.letMiddleware = function (target) {
  if (target) {
    target[symbols.CHECKERS.MIDDLEWARE] = true;
  }
};

exports.getControllerPrefix = function (target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_PREFIX])
    ? target[symbols.EXTRAS.CONTROLLER_PREFIX]
    : '';
};

exports.setControllerPrefix = function (target, prefix = '') {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_PREFIX] = prefix;
  }
};

exports.getControllerRoutes = function (target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_ROUTES])
    ? target[symbols.EXTRAS.CONTROLLER_ROUTES]
    : {};
};

exports.setControllerRoutes = function (target, routes = {}) {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_ROUTES] = routes;
  }
};

exports.getControllerMiddlewares = function (target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_MIDDLEWARES])
    ? target[symbols.EXTRAS.CONTROLLER_MIDDLEWARES]
    : [];
};

exports.setControllerMiddlewares = function (target, middlewares = []) {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_MIDDLEWARES] = middlewares;
  }
};

exports.getControllerRouteMiddlewares = function (target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_ROUTE_MIDDLEWARES])
    ? target[symbols.EXTRAS.CONTROLLER_ROUTE_MIDDLEWARES]
    : {};
};

exports.setControllerRouteMiddlewares = function (target, middlewares = {}) {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_ROUTE_MIDDLEWARES] = middlewares;
  }
};

exports.isNeedInjector = function (target) {
  return target && target[symbols.EXTRAS.NEED_INJECT] === true;
};

exports.setNeedInjector = function (target) {
  if (target) {
    target[symbols.EXTRAS.NEED_INJECT] = true;
  }
};

exports.getConstructorInjectors = function (target) {
  return (target && target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS])
    ? target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS]
    : [];
};

exports.setConstructorInjectors = function (target, injectors = []) {
  if (target) {
    target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS] = injectors;
  }
};

exports.getPropertyInjectors = function (target) {
  return (target && target[symbols.EXTRAS.PROPERTY_INJECTORS])
    ? target[symbols.EXTRAS.PROPERTY_INJECTORS]
    : {};
};

exports.setPropertyInjectors = function (target, injectors = {}) {
  if (target) {
    target[symbols.EXTRAS.PROPERTY_INJECTORS] = injectors;
  }
};


exports.getMethodInjectors = function (target) {
  return (target && target[symbols.EXTRAS.METHOD_INJECTORS])
    ? target[symbols.EXTRAS.METHOD_INJECTORS]
    : {};
};

exports.setMethodInjectors = function (target, injectors = {}) {
  if (target) {
    target[symbols.EXTRAS.METHOD_INJECTORS] = injectors;
  }
};
