/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { formatPrefix } = require('./helpers');
const { INJECT_ABLE } = require('../symbol');

const rest = {
  index: [{ uri: '/', method: 'get' }],
  create: [{ uri: '/create', method: 'get' }],
  show: [{ uri: '/:id', method: 'get' }],
  store: [{ uri: '/', method: 'post' }],
  edit: [{ uri: '/:id/edit', method: 'get' }],
  update: [{ uri: '/:id', method: 'put' }],
  destroy: [{ uri: '/:id', method: 'del' }],
};

function injectClass(target, prefix) {
  Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.setMetadata('prefix', formatPrefix(prefix), target.prototype);
  const routes = Reflect.getMetadata('routes', target.prototype);
  Reflect.setMetadata('routes', {
    ...rest,
    ...routes,
  }, target.prototype);
  return target;
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix);
  }
  throw new Error('@Rest must be decorate on Class');
}

module.exports = function Rest(prefix = '') {
  return (...args) => handle(args, prefix);
};
