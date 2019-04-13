/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { PREFIX, ISROUTE, ROUTES } = require('../symbol');

const rest = {
  index: { uri: '/', method: 'get' },
  create: { uri: '/create', method: 'get' },
  show: { uri: '/:id', method: 'get' },
  store: { uri: '/', method: 'post' },
  edit: { uri: '/:id/edit', method: 'get' },
  update: { uri: '/:id', method: 'put' },
  destroy: { uri: '/:id', method: 'del' },
};

function injectClass(target, prefix) {
  const tempTartget = target;
  const prefixed = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`;
  tempTartget.prototype[ISROUTE] = true;
  tempTartget.prototype[PREFIX] = prefixed;
  if (tempTartget.prototype[ROUTES]) {
    tempTartget.prototype[ROUTES] = Object.assign({}, tempTartget.prototype[ROUTES], rest);
  } else {
    tempTartget.prototype[ROUTES] = rest;
  }
  return target;
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix);
  }
  return undefined;
}

module.exports = function RestController(prefix = '') {
  return (...argsClass) => handle(argsClass, prefix);
};
