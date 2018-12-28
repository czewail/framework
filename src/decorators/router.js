/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { PREFIX, ISROUTE } = require('../symbol')
const { formatPrefix } = require('./helpers')

function injectClass(target, prefix) {
  target.prototype[ISROUTE] = true
  target.prototype[PREFIX] = formatPrefix(prefix)
  return target
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix)
  }
}

module.exports = function Router(prefix = '') {
  return function (...argsClass) {
    return handle(argsClass, prefix)
  }
}
