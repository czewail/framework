/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { patchClass, patchProperty, patchMethod } = require('./patch-controller-decorator')

function injectClass(target, params, type) {
  patchClass(type, params, target)
  // console.log(Object.getOwnPropertyNames(target.prototype))
  // console.log(target.prototype.__DAZE_CONSTRUCTOR__INJECTORS__)
  return target
}

function injectPropertyAndMethod(target, name, descriptor, params, type) {
  // patchControllerDecorator(type, params, target, name)
  if (Reflect.has(descriptor, 'value')) {
    patchMethod(type, params, target, name)
  }

  if (Reflect.has(descriptor, 'initializer')) {
    patchProperty(type, params, target, name)
  }
  return descriptor
}


function handle(args, params, type) {
  if (args.length === 1) {
    return injectClass(...args, params, type)
  } else {
    return injectPropertyAndMethod(...args, params, type)
  }
}

module.exports = function (type) {
  return (...args) => (...argsClass) => {
    return handle(argsClass, args, type)
  }
}
