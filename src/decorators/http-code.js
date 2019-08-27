/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { HTTP_CODE } = require('../symbol');

function injectedMethod(elementDescriptor, code) {
  return {
    ...elementDescriptor,
    finisher(target) {
      target.prototype[elementDescriptor.key][HTTP_CODE] = code;
      return target;
    },
  };
}

function handle(elementDescriptor, code) {
  const { kind } = elementDescriptor;
  if (kind === 'method') {
    return injectedMethod(elementDescriptor, code);
  }
  return elementDescriptor;
}

module.exports = function HttpCode(code = 200) {
  return elementDescriptor => handle(elementDescriptor, code);
};
