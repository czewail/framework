/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers');

function decorateMethod(target, name, descriptor, verb, uri) {
  const routes = Reflect.getMetadata('routes', target.prototype) || {};
  Reflect.setMetadata('routes', {
    ...routes,
    [`${name}`]: [
      ...routes[`${name}`] || [],
      {
        uri: formatPrefix(uri),
        method: verb,
      },
    ],
  }, target.prototype);
  return target;
}

function handle(args, verb, uri) {
  if (args.length > 1) {
    return decorateMethod(...args, verb, uri);
  }
  throw new Error('@Http[method] must be decorate on method');
}

function Verb(verb, uri = '/') {
  return (...args) => handle(args, verb, uri);
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
