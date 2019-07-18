/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decorateClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('ignore', true, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return decorateClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Injectable() {
  return elementDescriptor => handle(elementDescriptor);
};
