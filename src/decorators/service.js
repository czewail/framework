/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Meta = require('../foundation/support/meta');

function injectClass(target, serviceName) {
  Meta.set('isService', true, target.prototype);
  Meta.set('serviceName', serviceName, target.prototype);
  return target;
}

function handle(args, serviceName) {
  if (args.length === 1) {
    return injectClass(...args, serviceName);
  }
  return null;
}

module.exports = function Service(serviceName = '') {
  return (...argsClass) => handle(argsClass, serviceName);
};
