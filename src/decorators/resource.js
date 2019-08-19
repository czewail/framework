/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const proxy = require('../base/proxy');
const BaseResource = require('../base/resource');

function decoratorClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'resource', target.prototype);
      Reflect.setMetadata('resource', name, target.prototype);
      return proxy(target, BaseResource);
    },
  };
}

function handle(elementDescriptor, name) {
  if (elementDescriptor.kind === 'class') {
    return decoratorClass(elementDescriptor, name);
  }
  return elementDescriptor;
}

module.exports = function Resource(name) {
  return elementDescriptor => handle(elementDescriptor, name);
};
