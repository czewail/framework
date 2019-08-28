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

function decoratorClass(target, prefix) {
  Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.setMetadata('type', 'controller', target.prototype);
  Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
  return proxy(target, BaseController);
}

function handle(args, prefix) {
  if (args.length === 1) {
    return decoratorClass(...args, prefix);
  }
  throw new Error('@Controller must be decorate on Class');
}

module.exports = function Controller(prefix = '') {
  return function (...args) {
    return handle(args, prefix);
  };
};
