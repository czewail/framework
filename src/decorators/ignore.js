/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decorateClass(target) {
  Reflect.defineMetadata('ignore', true, target.prototype);
  return target;
}

function handle(args) {
  if (args.length === 1) {
    return decorateClass(...args);
  }
  throw new Error('@Ignore must be decorate on Class');
}

module.exports = function Ignore() {
  return (...args) => handle(args);
};
