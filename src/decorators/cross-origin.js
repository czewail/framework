/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
function decoratorClass(target, options) {
  Reflect.setMetadata('controllerCrossOrigin', {
    ...options,
  }, target.prototype);
  return target;
}

function decoratorMethod(elementDescriptor, options) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const corses = Reflect.getMetadata('routeCrossOrigin', target) ?? {};
      corses[elementDescriptor.key] = {
        ...options,
      };
      Reflect.setMetadata('routeCrossOrigin', corses, target);
      return target;
    },
  };
}

function handle(args, options) {
  if (args.length === 1) {
    return decoratorClass(...args, options);
  }
  return decoratorMethod(...args, options);
}

module.exports = function CrossOrigin(options = {}) {
  return (...args) => handle(args, options);
};
