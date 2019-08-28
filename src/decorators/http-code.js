/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { HTTP_CODE } = require('../symbol');

function injectedMethod(target, name, descriptor, code) {
  target[name][HTTP_CODE] = code;
  return target;
}

function handle(args, code) {
  if (args.length > 1) {
    return injectedMethod(...args, code);
  }
  throw new Error('@HttpCode must be decorate on method');
}

module.exports = function HttpCode(code = 200) {
  return (...args) => handle(args, code);
};
