/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { HTTP_CODE } = require('../symbol');

function injectdMethod(elementDescriptor, code) {
  return {
    ...elementDescriptor,
    finisher(target) {
      target.prototype[elementDescriptor.key][HTTP_CODE] = code;
    },
  };
}

function handle(elementDescriptor, code) {
  const { kind } = elementDescriptor;
  if (kind === 'method') {
    return injectdMethod(elementDescriptor, code);
  }
  return elementDescriptor;
}

module.exports = function HttpCode(code = 200) {
  return elementDescriptor => handle(elementDescriptor, code);
};
