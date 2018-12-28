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
    result.resolve = function (value) {
      resolve(value)
    }
    result.reject = function (value) {
      reject(value)
    }
  })
  return result
}

/**
 * Determine whether the target can be traversed
 */
exports.iterable = function (target) {
  return !!target[Symbol.iterator]
}
