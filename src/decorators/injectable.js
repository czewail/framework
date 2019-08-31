/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { INJECT_ABLE } = require('../symbol');

function decorateClass(target) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  return target;
}

function handle(args) {
  if (args.length === 1) {
    return decorateClass(...args);
  }
  throw new Error('@Injectable must be decorate on Class');
}

module.exports = function Injectable() {
  return (...args) => handle(args);
};
