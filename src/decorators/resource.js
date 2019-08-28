/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const proxy = require('../base/proxy');
const BaseResource = require('../base/resource');

function decoratorClass(target, name) {
  Reflect.setMetadata('type', 'resource', target.prototype);
  Reflect.setMetadata('name', name, target.prototype);
  return proxy(target, BaseResource);
}

function handle(args, name) {
  if (args.length === 1) {
    return decoratorClass(...args, name);
  }
  throw new Error('@Resource must be decorate on Class');
}

module.exports = function Resource(name) {
  return (...args) => handle(args, name);
};
