/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// const Inject = require('./inject')
const Controller = require('./controller')
const Module = require('./module')
const Rest = require('./rest')
const Multiton = require('./multiton')
const Middleware = require('./middleware')
const Verbs = require('./verb')
const Contexts = require('./contexts')
const HttpCode = require('./http-code')

module.exports = Object.assign({
  Controller, Module, Rest, Multiton, Middleware, HttpCode,
}, Verbs, Contexts)
