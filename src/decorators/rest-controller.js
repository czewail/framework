/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { formatPrefix } = require('./helpers');
const proxy = require('../base/proxy');
const BaseController = require('../base/controller');

const rest = {
  index: { uri: '/', method: 'get' },
  create: { uri: '/create', method: 'get' },
  show: { uri: '/:id', method: 'get' },
  store: { uri: '/', method: 'post' },
  edit: { uri: '/:id/edit', method: 'get' },
  update: { uri: '/:id', method: 'put' },
  destroy: { uri: '/:id', method: 'del' },
};

function injectClass(elementDescriptor, prefix) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'controller', target.prototype);
      Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
      const routes = Reflect.getMetadata('routes', target.prototype);
      Reflect.setMetadata('routes', {
        ...routes,
        ...rest,
      }, target.prototype);
      return proxy(target, BaseController);
    },
  };
}

function handle(elementDescriptor, prefix) {
  const { kind } = elementDescriptor;
  if (kind === 'class') {
    return injectClass(elementDescriptor, prefix);
  }
  return elementDescriptor;
}

module.exports = function RestController(prefix = '') {
  return elementDescriptor => handle(elementDescriptor, prefix);
};
