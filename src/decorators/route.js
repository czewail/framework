/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { formatPrefix } = require('./helpers');
const { INJECT_ABLE } = require('../symbol');

function decoratorClass(target, prefix) {
  Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.setMetadata('isRoute', true, target.prototype);
  Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
  return target;
}

function handle(args, prefix) {
  if (args.length === 1) {
    return decoratorClass(...args, prefix);
  }
  throw new Error('@Route must be decorate on Class');
}

module.exports = function Route(prefix = '') {
  return function (...args) {
    return handle(args, prefix);
  };
};
