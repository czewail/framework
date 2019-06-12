

/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Metadata = require('../foundation/support/metadata');
const Component = require('../component');

function injectClass(elementDescriptor, service) {
  return {
    ...elementDescriptor,
    finisher(target) {
      if (!Metadata.has('component', target.prototype)) {
        Metadata.set('component', new Component(), target.prototype);
      }
      const _Component = Metadata.get('component', target.prototype);
      _Component.register(service);
      return target;
    },
  };
}

function handle(elementDescriptor, service) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor, service);
  }
  throw new Error('@useService must use on class');
}

module.exports = function useService(service) {
  return elementDescriptor => handle(elementDescriptor, service);
};
