/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Meta = require('../foundation/support/meta')
const Container = require('../container')

function injectClass(target) {
  Meta.set('isModule', true, target.prototype)
  Container.bind(target, target)
  Container.tag(target, 'modules')
  return target
}

function handle(args) {
  if (args.length === 1) {
    return injectClass(...args)
  }
}

module.exports = function Module() {
  return function (...argsClass) {
    return handle(argsClass)
  }
}
