/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { RUNTIME } = require('../symbol')

function createRuntimeClass(klass) {
  klass[RUNTIME] = true
  return klass
}

function handle(argsClass) {
  if (argsClass.length === 1) {
    return createRuntimeClass(...argsClass)
  }
  throw new Error('@Runtime must be used on class')
}

module.exports = function Runtime() {
  return function (...argsClass) {
    return handle(argsClass)
  }
}
