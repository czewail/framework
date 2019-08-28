/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { MULTITON } = require('../symbol');

function createMultitonClass(target) {
  target[MULTITON] = true;
  return target;
}

function handle(args) {
  if (args.length === 1) {
    return createMultitonClass(...args);
  }
  throw new Error('@Multiton must be decorate on Class');
}

module.exports = function Multiton() {
  return (...args) => handle(args);
};
