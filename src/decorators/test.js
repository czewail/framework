/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const symbols = require('../symbol');

function injectClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    elements: [
      ...elementDescriptor.elements,
      {
        kind: 'field',
        key: symbols.CHECKERS.MODULE,
        placement: 'prototype',
        descriptor: {
          configurable: true,
          writable: true,
          enumerable: true,
        },
        initializer() {
          return true;
        },
      },
    ],
  };
}

function handle(elementDescriptor) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Test() {
  return elementDescriptor => handle(elementDescriptor);
};
