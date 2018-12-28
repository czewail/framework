/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { ROUTES } = require('../symbol')

function decorateMethod(target, name, descriptor, verb, uri) {
  if (!target[ROUTES]) {
    target[ROUTES] = {}
  }
  target[ROUTES] = Object.assign({}, target[ROUTES], {
    [`${name}`]: {
      uri: uri.slice(0, 1) === '/' ? uri : `/${uri}`,
      method: verb,
    }
  })

  // if (!Reflect.hasMetadata(ROUTES, target)) {
  //   Reflect.defineMetadata(ROUTES, {}, target)
  // }
  // Reflect.defineMetadata(ROUTES, Object.assign({}, Reflect.getMetadata(ROUTES, target), {
  //   [`${name}`]: {
  //     uri: uri.slice(0, 1) === '/' ? uri : `/${uri}`,
  //     method: verb,
  //   }
  // }), target)
  return descriptor
}

function handle(args, verb, uri) {
  if (args.length !== 1) {
    return decorateMethod(...args, verb, uri)
  }
}

function Verb(verb, uri = '/') {
  return function (...argsClass) {
    return handle(argsClass, verb, uri)
  }
}

exports.Get = function (uri) {
  return Verb('get', uri)
}

exports.Post = function (uri) {
  return Verb('post', uri)
}

exports.Put = function (uri) {
  return Verb('put', uri)
}

exports.Patch = function (uri) {
  return Verb('patch', uri)
}

exports.Options = function (uri) {
  return Verb('options', uri)
}

exports.Head = function (uri) {
  return Verb('head', uri)
}

exports.Delete = function (uri) {
  return Verb('delete', uri)
}

exports.Del = function (uri) {
  return Verb('del', uri)
}

exports.All = function (uri) {
  return Verb('all', uri)
}
