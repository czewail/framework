/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// const { Item, Collection } = require('../resource');
// const ResourceFactory = require('../resource/DEPRECATED_factory');
const proxy = require('../base/proxy');
const BaseResource = require('../base/resource');

function injectClass(elementDescriptor, name) {
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
    return injectClass(elementDescriptor, name);
  }
  return elementDescriptor;
}

module.exports = function Resource(name) {
  return elementDescriptor => handle(elementDescriptor, name);
};
