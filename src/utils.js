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

exports.isModule = function isModule(target) {
  return target && target[symbols.CHECKERS.MODULE] === true;
};

exports.letModule = function letModule(target) {
  if (target) {
    target[symbols.CHECKERS.MODULE] = true;
  }
};

exports.isController = function isController(target) {
  return target && target[symbols.CHECKERS.CONTROLLER] === true;
};

exports.letController = function letController(target) {
  if (target) {
    target[symbols.CHECKERS.CONTROLLER] = true;
  }
};

exports.isMiddleware = function isMiddleware(target) {
  return target && target[symbols.CHECKERS.MIDDLEWARE] === true;
};

exports.letMiddleware = function letMiddleware(target) {
  if (target) {
    target[symbols.CHECKERS.MIDDLEWARE] = true;
  }
};

exports.getControllerPrefix = function getControllerPrefix(target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_PREFIX])
    ? target[symbols.EXTRAS.CONTROLLER_PREFIX]
    : '';
};

exports.setControllerPrefix = function setControllerPrefix(target, prefix = '') {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_PREFIX] = prefix;
  }
};

exports.getControllerRoutes = function getControllerRoutes(target) {
  return (target && target[symbols.EXTRAS.CONTROLLER_ROUTES])
    ? target[symbols.EXTRAS.CONTROLLER_ROUTES]
    : {};
};

exports.setControllerRoutes = function setControllerRoutes(target, routes = {}) {
  if (target) {
    target[symbols.EXTRAS.CONTROLLER_ROUTES] = routes;
  }
};

exports.isNeedInjector = function isNeedInjector(target) {
  return target && target[symbols.EXTRAS.NEED_INJECT] === true;
};

exports.setNeedInjector = function setNeedInjector(target) {
  if (target) {
    target[symbols.EXTRAS.NEED_INJECT] = true;
  }
};

exports.getConstructorInjectors = function getConstructorInjectors(target) {
  return (target && target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS])
    ? target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS]
    : [];
};

exports.setConstructorInjectors = function setConstructorInjectors(target, injectors = []) {
  if (target) {
    target[symbols.EXTRAS.CONSTRUCTOR_INJECTORS] = injectors;
  }
};

exports.getPropertyInjectors = function getPropertyInjectors(target) {
  return (target && target[symbols.EXTRAS.PROPERTY_INJECTORS])
    ? target[symbols.EXTRAS.PROPERTY_INJECTORS]
    : {};
};

exports.setPropertyInjectors = function setPropertyInjectors(target, injectors = {}) {
  if (target) {
    target[symbols.EXTRAS.PROPERTY_INJECTORS] = injectors;
  }
};


exports.getMethodInjectors = function getMethodInjectors(target) {
  return (target && target[symbols.EXTRAS.METHOD_INJECTORS])
    ? target[symbols.EXTRAS.METHOD_INJECTORS]
    : {};
};

exports.setMethodInjectors = function setMethodInjectors(target, injectors = {}) {
  if (target) {
    target[symbols.EXTRAS.METHOD_INJECTORS] = injectors;
  }
};
