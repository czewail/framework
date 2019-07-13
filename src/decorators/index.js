/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Controller = require('./controller');
const RestController = require('./rest-controller');
const Service = require('./service');
const Multiton = require('./multiton');
const Resource = require('./resource');
const Component = require('./component');
const Validator = require('./validator');
const Ignore = require('./ignore');
const useMiddleware = require('./use-middleware');
const Verbs = require('./verb');
const Contexts = require('./contexts');
const HttpCode = require('./http-code');
const Middleware = require('./middleware');
const CrossOrigin = require('./cross-origin');
const ValidateDecorators = require('../validate/decorators');
const InjectAble = require('./injectable');

const Http = {
  Code: HttpCode,
  ...Verbs,
};

module.exports = {
  Controller,
  RestController,
  Service,
  Resource,
  Component,
  Validator,
  Middleware,
  Multiton,
  useMiddleware,
  Http,
  CrossOrigin,
  Ignore,
  InjectAble,
  ...Contexts,
  ...ValidateDecorators,
};
