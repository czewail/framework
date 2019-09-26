/**
 *
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
require('reflect-metadata');

const Application = require('./foundation/application');
const Container = require('./container');
const Response = require('./response');
const Redirect = require('./response/redirect');
const View = require('./view');
const Cookie = require('./cookie');
const Decorators = require('./decorators');
const Controller = require('./base/controller');
const Service = require('./base/service');
const Validator = require('./base/validator');
const Resource = require('./base/resource');
const Provider = require('./base/provider');
const Middleware = require('./base/middleware');

module.exports = {
  Application,
  Container,
  Response,
  Redirect,
  View,
  Cookie,
  Controller,
  Service,
  Validator,
  Resource,
  Provider,
  Middleware,
  ...Decorators,
};
