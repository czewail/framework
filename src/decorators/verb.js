/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Meta = require('../foundation/support/meta');
const { formatPrefix } = require('./helpers');

function decorateMethod(target, name, descriptor, verb, uri) {
  if (!Meta.has('routes', target)) {
    Meta.set('routes', {}, target);
  }
  Meta.set('routes', {
    ...Meta.get('routes', target),
    [`${name}`]: {
      uri: formatPrefix(uri),
      method: verb,
      action: name,
    },
  }, target);
  return descriptor;
}

function handle(args, verb, uri) {
  if (args.length !== 1) {
    return decorateMethod(...args, verb, uri);
  }
  return undefined;
}

function Verb(verb, uri = '/') {
  return function resolve(...argsClass) {
    return handle(argsClass, verb, uri);
  };
}

exports.Get = function Get(uri) {
  return Verb('get', uri);
};

exports.Post = function Post(uri) {
  return Verb('post', uri);
};

exports.Put = function Put(uri) {
  return Verb('put', uri);
};

exports.Patch = function Patch(uri) {
  return Verb('patch', uri);
};

exports.Options = function Options(uri) {
  return Verb('options', uri);
};

exports.Head = function Head(uri) {
  return Verb('head', uri);
};

exports.Delete = function Delete(uri) {
  return Verb('delete', uri);
};

exports.Del = function Del(uri) {
  return Verb('del', uri);
};

exports.All = function All(uri) {
  return Verb('all', uri);
};
