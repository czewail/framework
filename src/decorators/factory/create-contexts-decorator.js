/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { patchClass, patchProperty, patchMethod } = require('./patch-controller-decorator')

function injectClass(target, params, type) {
  patchClass(type, params, target)
  return target
}

function injectPropertyAndMethod(target, name, descriptor, params, type) {
  if (Reflect.has(descriptor, 'value') && typeof descriptor.value === 'function') {
    patchMethod(type, params, target, name)
  }

  if (Reflect.has(descriptor, 'initializer') || Reflect.has(descriptor, 'get')) {
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
