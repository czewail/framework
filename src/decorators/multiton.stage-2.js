/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { MULTITON } = require('../symbol');

function createMultitonClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      target[MULTITON] = true;
      return target;
    },
  };
}

function handle(elementDescriptor) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return createMultitonClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Multiton() {
  return elementDescriptor => handle(elementDescriptor);
};
