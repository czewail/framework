/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


function decoratorClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'validator', target.prototype);
      Reflect.setMetadata('validator', name, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, name) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return decoratorClass(elementDescriptor, name);
  }
  return elementDescriptor;
}

module.exports = function Validate(name = '') {
  return elementDescriptor => handle(elementDescriptor, name);
};
