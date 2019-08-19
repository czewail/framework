/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const proxy = require('../base/proxy');
const BaseMiddleware = require('../base/middleware');

function decoratorClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'middleware', target.prototype);
      Reflect.setMetadata('middlewareName', name, target.prototype);
      return proxy(target, BaseMiddleware);
    },
  };
}

function handle(elementDescriptor, name) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return decoratorClass(elementDescriptor, name);
  }
  throw new TypeError('@Middleware must use on class');
}

module.exports = function Middleware(name) {
  return elementDescriptor => handle(elementDescriptor, name);
};
