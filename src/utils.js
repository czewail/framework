/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * defer function based on promise
 * 基于 promise 的延迟函数
 */
exports.defer = function () {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

/**
 * Determine whether the target can be traversed
 */
exports.iterable = function (target) {
  return !!target[Symbol.iterator]
}

/**
 * Checks if the class method exists
 */
exports.method_exists = function (obj, name) {
  return Reflect.has(obj, name) && typeof Reflect.get(obj, name) === 'function'
}

/**
 * Checks if the object or class has a property
 */
exports.property_exists = function (obj, name) {
  return Reflect.has(obj, name) && typeof Reflect.get(obj, name) !== 'function'
}
