/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { MULTITON } = require('../symbol');

function createMultitonClass(klass) {
  klass[MULTITON] = true;
  return klass;
}

function handle(argsClass) {
  if (argsClass.length === 1) {
    return createMultitonClass(...argsClass);
  }
  throw new Error('@Multiton must be used on class');
}

module.exports = function Multiton() {
  return function (...argsClass) {
    return handle(argsClass);
  };
};
