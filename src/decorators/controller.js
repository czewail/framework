/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers');
const { letController, setControllerPrefix } = require('../utils');

function injectClass(elementDescriptor, prefix) {
  return {
    ...elementDescriptor,
    finisher(target) {
      letController(target.prototype);
      setControllerPrefix(target.prototype, formatPrefix(prefix));
      return target;
    },
  };
}

function handle(elementDescriptor, prefix) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor, prefix);
  }
  return elementDescriptor;
}

module.exports = function Controller(prefix = '') {
  return elementDescriptor => handle(elementDescriptor, prefix);
};
