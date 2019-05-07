/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { setControllerPrefix, getControllerRoutes, setControllerRoutes } = require('../utils');

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
      const prefixed = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`;
      setControllerPrefix(target.prototype, prefixed);
      const routes = getControllerRoutes(target.prototype);
      setControllerRoutes(target.prototype, {
        ...routes,
        ...rest,
      });
      return target;
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
