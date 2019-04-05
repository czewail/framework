/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// const Inject = require('./inject')
const Controller = require('./controller');
const Module = require('./module');
const Rest = require('./rest');
const Multiton = require('./multiton');
const UseMiddleware = require('./use-middleware');
const Verbs = require('./verb');
const Contexts = require('./contexts');
const HttpCode = require('./http-code');
const Middleware = require('./middleware');

module.exports = {
  Controller,
  Module,
  Rest,
  Multiton,
  UseMiddleware,
  Middleware,
  HttpCode,
  ...Verbs,
  ...Contexts,
};
