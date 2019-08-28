/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const proxy = require('../base/proxy');
const BaseService = require('../base/service');

function injectClass(target, name) {
  Reflect.setMetadata('type', 'service', target.prototype);
  Reflect.setMetadata(name, name, target.prototype);
  return proxy(target, BaseService);
}

function handle(args, name) {
  if (args.length === 1) {
    return injectClass(...args, name);
  }
  throw new Error('@Controller must be decorate on Class');
}

module.exports = function Controller(name = '') {
  return (...args) => handle(args, name);
};
