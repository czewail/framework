/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { INJECT_ABLE } = require('../symbol');

function decorateClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
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
