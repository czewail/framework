/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers')
const Meta = require('../foundation/support/meta')

function injectClass(target, prefix) {
  Meta.set('isController', true, target.prototype)
  Meta.set('prefix', formatPrefix(prefix), target.prototype)
  return target
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix)
  }
}

module.exports = function Controller(prefix = '') {
  return function (...argsClass) {
    return handle(argsClass, prefix)
  }
}
