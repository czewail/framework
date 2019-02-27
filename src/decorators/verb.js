/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Meta = require('../foundation/support/meta')

function decorateMethod(target, name, descriptor, verb, uri) {
  if (!Meta.has('routes', target)) {
    Meta.set('routes', [], target)
  }
  Meta.set('routes', [...Meta.get('routes', target), {
    uri: uri.slice(0, 1) === '/' ? uri : `/${uri}`,
    method: verb,
    action: name
  }], target)
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
