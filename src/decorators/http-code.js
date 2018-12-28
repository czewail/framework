/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { HTTP_CODE } = require('../symbol')

function injectdMethod(target, name, descriptor, code) {
  target[name][HTTP_CODE] = code
  return descriptor
}

function handle(args, code) {
  if (args.length === 3) {
    return injectdMethod(...args, code)
  }
}

module.exports = function Inject(code = 200) {
  return function (...argsClass) {
    return handle(argsClass, code)
  }
}
