/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { patchClass, patchProperty, patchMethod } = require('./patch-decorator');

function handle(elementDescriptor, params, type) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return patchClass(type, params, elementDescriptor);
  }
  if (kind === 'field') {
    return patchProperty(type, params, elementDescriptor);
  }
  if (kind === 'method') {
    return patchMethod(type, params, elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function create(type) {
  return (...args) => elementDescriptor => handle(elementDescriptor, args, type);
};
