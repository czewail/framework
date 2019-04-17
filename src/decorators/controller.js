/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers');
const Meta = require('../foundation/support/meta');
// const BaseController = require('../base/controller');
// const symbols = require('../symbol');

// const constrollerGetterMap = {
//   ctx: (t) => {
//     const [ctx] = t[symbols.INJECT_CONTAINER_ARGS];
//     return ctx;
//   },
// };

function injectClass(target, prefix) {
  Meta.set('isController', true, target.prototype);
  Meta.set('prefix', formatPrefix(prefix), target.prototype);
  return target;
  // return new Proxy(target, {
  //   construct(Target, newArgs, extended) {
  //     const instance = Reflect.construct(Target, newArgs, extended);
  //     return new Proxy(instance, {
  //       get(tar, property, receiver) {
  //         // if (property === '__context__') {
  //         //   console.log(Reflect.get(tar, '__context__', receiver));
  //         //   return Reflect.get(tar, property, receiver);
  //         // }
  //         return Reflect.get(tar, property, receiver);
  //       },
  //     });
  //   },
  // });
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix);
  }
  return null;
}

module.exports = function Controller(prefix = '') {
  return (...argsClass) => handle(argsClass, prefix);
};
