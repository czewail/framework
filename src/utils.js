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
