/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container')

const CTX = Symbol('Base#ctx')

class Base {
  [CTX] = null;

  setCtx(ctx) {
    this[CTX] = ctx
  }

  get app() {
    return Container.get('app')
  }

  get config() {
    return Container.get('config')
  }

  get messenger() {
    return Container.get('messenger')
  }

  get request() {
    return Container.get('request', [this[CTX]])
  }

  get ctx() {
    return this[CTX]
  }

  get response() {
    return Container.get('response')
  }

  get redirect() {
    return Container.get('redirect')
  }

  get cookies() {
    return this.cookie
  }

  get cookie() {
    return Container.get('cookie')
  }

  get session() {
    return Container.get('session', [this[CTX]])
  }

  get view() {
    return Container.get('view')
  }

  get body() {
    return this.request.body
  }

  get params() {
    return this.ctx.params
  }

  get query() {
    return this.request.query
  }

  get headers() {
    return this.request.headers
  }

  get $http() {
    return Container.get('axios')
  }
}

module.exports = Base
