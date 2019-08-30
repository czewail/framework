/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// const Controller = require('./controller');
const Route = require('./route');
const Rest = require('./rest');
// const Service = require('./service');
const Multiton = require('./multiton');
// const Resource = require('./resource');
const Component = require('./component');
// const Validator = require('./validator');
// const Provider = require('./provider');
const Ignore = require('./ignore');
const useMiddleware = require('./use-middleware');
const Verbs = require('./verb');
const Contexts = require('./contexts');
const HttpCode = require('./http-code');
// const Middleware = require('./middleware');
const CrossOrigin = require('./cross-origin');
const ValidateDecorators = require('../validate/decorators');
const InjectAble = require('./injectable');
const Csrf = require('./csrf');

const Http = {
  Code: HttpCode,
  ...Verbs,
};

module.exports = {
  Route,
  Rest,
  Component,
  Multiton,
  useMiddleware,
  Http,
  CrossOrigin,
  Csrf,
  Ignore,
  InjectAble,
  ...Contexts,
  ...ValidateDecorators,
};
