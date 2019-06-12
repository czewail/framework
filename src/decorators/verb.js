/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { formatPrefix } = require('./helpers');

function decorateMethod(elementDescriptor, verb, uri) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const routes = Reflect.getMetadata('routes', target.prototype);
      Reflect.setMetadata('routes', {
        ...routes,
        [`${elementDescriptor.key}`]: {
          uri: formatPrefix(uri),
          method: verb,
          action: elementDescriptor.key,
        },
      }, target.prototype);
      return target;
    },
  };
}

function handle(elementDescriptor, verb, uri) {
  const { kind } = elementDescriptor;
  if (kind === 'method') {
    return decorateMethod(elementDescriptor, verb, uri);
  }
  return elementDescriptor;
}

function Verb(verb, uri = '/') {
  return function resolve(elementDescriptor) {
    return handle(elementDescriptor, verb, uri);
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
