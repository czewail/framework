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

function decoratorClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'provider', target.prototype);
      return proxy(target, BaseResource);
    },
  };
}

function handle(elementDescriptor) {
  if (elementDescriptor.kind === 'class') {
    return decoratorClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Provider() {
  return elementDescriptor => handle(elementDescriptor);
};
