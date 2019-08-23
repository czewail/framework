/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const proxy = require('../base/proxy');
const BaseProvider = require('../base/provider');

function decoratorClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'provider', target.prototype);
      Reflect.setMetadata('type', name, target.prototype);
      return proxy(target, BaseProvider);
    },
  };
}

function handle(elementDescriptor, name) {
  if (elementDescriptor.kind === 'class') {
    return decoratorClass(elementDescriptor, name);
  }
  return elementDescriptor;
}

module.exports = function Provider(name) {
  return elementDescriptor => handle(elementDescriptor, name);
};
