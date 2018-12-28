/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { MIDDLEWARES } = require('../symbol')

function injectClass(target, middlewares) {
  // Reflect.defineMetadata(MIDDLEWARES, middlewares, target.prototype)
  target.prototype[MIDDLEWARES] = middlewares

  // Reflect.defineMetadata(ISROUTE, true, target.prototype)
  // Reflect.defineMetadata(PREFIX, _prefix, target.prototype)
  return target
}

function handle(args, middlewares) {
  if (args.length === 1) {
    return injectClass(...args, middlewares)
  }
}

module.exports = function Middleware(...middlewares) {
  return function (...argsClass) {
    return handle(argsClass, middlewares)
  }
}
