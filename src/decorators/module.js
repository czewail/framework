/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Meta = require('../foundation/support/meta');

function injectClass(target) {
  Meta.set('isModule', true, target.prototype);
  return target;
}

function handle(args) {
  if (args.length === 1) {
    return injectClass(...args);
  }
  throw new TypeError('@Module must use on class');
}

module.exports = function Module() {
  return (...argsClass) => handle(argsClass);
};
