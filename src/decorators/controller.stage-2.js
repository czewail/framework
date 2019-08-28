/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { formatPrefix } = require('./helpers');
const { INJECT_ABLE } = require('../symbol');
const proxy = require('../base/proxy');
const BaseController = require('../base/controller');

function decoratorClass(elementDescriptor, prefix) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
      Reflect.setMetadata('type', 'controller', target.prototype);
      Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
      return proxy(target, BaseController);
    },
  };
}

function handle(elementDescriptor, prefix) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return decoratorClass(elementDescriptor, prefix);
  }
  return elementDescriptor;
}

module.exports = function Controller(prefix = '') {
  return elementDescriptor => handle(elementDescriptor, prefix);
};
