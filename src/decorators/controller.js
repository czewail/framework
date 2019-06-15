/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers');

function injectClass(elementDescriptor, prefix) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'controller', target.prototype);
      Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, prefix) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor, prefix);
  }
  return elementDescriptor;
}

module.exports = function Controller(prefix = '') {
  return elementDescriptor => handle(elementDescriptor, prefix);
};
