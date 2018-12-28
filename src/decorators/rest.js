/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { PREFIX, ISROUTE, ROUTES } = require('../symbol')

const rest = {
  index: { uri: '/', method: 'get' },
  create: { uri: '/create', method: 'get' },
  show: { uri: '/:id', method: 'get' },
  store: { uri: '/', method: 'post' },
  edit: { uri: '/:id/edit', method: 'get' },
  update: { uri: '/:id', method: 'put' },
  destroy: { uri: '/:id', method: 'del' },
}

function injectClass(target, prefix) {
  const _prefix = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`
  target.prototype[ISROUTE] = true
  target.prototype[PREFIX] = _prefix
  if (target.prototype[ROUTES]) {
    target.prototype[ROUTES] = Object.assign({}, target.prototype[ROUTES], rest)
  } else {
    target.prototype[ROUTES] = rest
  }

  // Reflect.defineMetadata(ISROUTE, true, target.prototype)
  // Reflect.defineMetadata(PREFIX, _prefix, target.prototype)
  // if (Reflect.hasMetadata(ROUTES, target.prototype)) {
  //   Reflect.defineMetadata(ROUTES, Object.assign({}, Reflect.getMetadata(ROUTES, target.prototype), rest), target.prototype)
  // } else {
  //   Reflect.defineMetadata(ROUTES, rest, target.prototype)
  // }
  return target
}

function handle(args, prefix) {
  if (args.length === 1) {
    return injectClass(...args, prefix)
  }
}

module.exports = function Rest(prefix = '') {
  return function (...argsClass) {
    return handle(argsClass, prefix)
  }
}
