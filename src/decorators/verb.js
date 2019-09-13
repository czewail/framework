/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const http = require('http');
const { formatPrefix } = require('./helpers');

function decorateMethod(target, name, descriptor, methods, uri) {
  const routes = Reflect.getMetadata('routes', target) || {};
  if (!routes[name]) routes[name] = [];
  for (const method of methods) {
    routes[name].push({
      uri: formatPrefix(uri),
      method,
    });
  }
  Reflect.defineMetadata('routes', routes, target);
  return target;
}

function handle(args, methods, uri) {
  if (args.length > 1) {
    return decorateMethod(...args, methods, uri);
  }
  throw new Error('@Http[method] must be decorate on method');
}

function Verb(methods, uri = '/') {
  return (...args) => handle(args, methods, uri);
}

exports.Get = function Get(uri) {
  return Verb(['GET'], uri);
};

exports.Post = function Post(uri) {
  return Verb(['POST'], uri);
};

exports.Put = function Put(uri) {
  return Verb(['PUT'], uri);
};

exports.Patch = function Patch(uri) {
  return Verb(['PATCH'], uri);
};

exports.Options = function Options(uri) {
  return Verb(['OPTIONS'], uri);
};

exports.Head = function Head(uri) {
  return Verb(['HEAD'], uri);
};

exports.Delete = function Delete(uri) {
  return Verb(['DELETE'], uri);
};

exports.Del = function Del(uri) {
  return Verb(['DEL'], uri);
};

exports.All = function All(uri, methods = http.METHODS) {
  return Verb(methods, uri);
};
