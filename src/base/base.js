/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { INJECTOR_CONETXT } = require('../symbol')

class Base {
  constructor(ctx) {
    if (!ctx) {
      throw new Error('Base constructor must param ctx!')
    }
    this.context = ctx.injectorContext || {}
  }

  get app() {
    return this.context[INJECTOR_CONETXT.APP]
  }

  get config() {
    return this.context[INJECTOR_CONETXT.CONFIG]
  }

  get messenger() {
    return this.context[INJECTOR_CONETXT.MESSENGER]
  }

  get request() {
    return this.context[INJECTOR_CONETXT.REQUEST]
  }

  get ctx() {
    return this.context[INJECTOR_CONETXT.CTX]
  }

  get response() {
    return this.context[INJECTOR_CONETXT.RESPONSE]
  }

  get redirect() {
    return this.context[INJECTOR_CONETXT.REDIRECT]
  }

  get cookies() {
    return this.cookie
  }

  get cookie() {
    return this.context[INJECTOR_CONETXT.COOKIE]
  }

  get session() {
    return this.context[INJECTOR_CONETXT.SESSION]
  }

  get view() {
    return this.context[INJECTOR_CONETXT.VIEW]
  }

  get body() {
    return this.context[INJECTOR_CONETXT.BODY]
  }

  get params() {
    return this.context[INJECTOR_CONETXT.PARAMS]
  }

  get query() {
    return this.context[INJECTOR_CONETXT.QUERY]
  }

  get headers() {
    return this.context[INJECTOR_CONETXT.HEADERS]
  }

  get $http() {
    return this.context[INJECTOR_CONETXT.AXIOS]
  }
}

module.exports = Base
