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
exports.iterable = function (target) {
  return !!target[Symbol.iterator];
};

/**
 * proxy `__get__` method
 */
exports.getMethodProxy = function (klass) {
  return new Proxy(klass, {
    construct(target, argArray, newTarget) {
      const instance = Reflect.construct(target, argArray, newTarget);
      return new Proxy(instance, {
        get(t, p, r) {
          if (Reflect.has(t, p)) return Reflect.get(t, p, r);
          return Reflect.apply(t.__get__, t, [p]);
        },
      });
    },
  });
};
