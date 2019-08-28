/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function injectClass(elementDescriptor, options) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('controllerCrossOrigin', {
        ...options,
      }, target.prototype);
      return target;
    },
  };
}


function injectMethod(elementDescriptor, options) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const corses = Reflect.getMetadata('routeCrossOrigin', target.prototype) ?? {};
      corses[elementDescriptor.key] = {
        ...options,
      };
      Reflect.setMetadata('routeCrossOrigin', corses, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, options) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor, options);
  }
  if (elementDescriptor.kind === 'method') {
    return injectMethod(elementDescriptor, options);
  }
  return elementDescriptor;
}

module.exports = function CrossOrigin(options = {}) {
  return elementDescriptor => handle(elementDescriptor, options);
};
