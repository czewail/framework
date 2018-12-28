/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { INJECTOR_CONETXT } = require('../../symbol')
const Reponse = require('../../response')
const Redirect = require('../../response/redirect')
const Request = require('../../request')
const View = require('../../view')

module.exports = function (
  app,
  ctx,
  next
) {
  const request = new Request(ctx)

  return {
    /**
     * Inject Koa ctx
     */
    get [`${INJECTOR_CONETXT.CTX}`]() {
      return ctx
    },

    /**
     * Inject Koa next
     */
    get [`${INJECTOR_CONETXT.NEXT}`]() {
      return next
    },

    /**
     * Inject Request
     */
    get [`${INJECTOR_CONETXT.REQUEST}`]() {
      return request
    },

    /**
     * Inject ctx.session
     */
    get [`${INJECTOR_CONETXT.SESSION}`]() {
      return request.session()
    },

    /**
     * Inject ctx.cookies
     */
    get [`${INJECTOR_CONETXT.COOKIE}`]() {
      return (...params) => request.getCookie(...params)
    },

    /**
     * Inject Response
     */
    get [`${INJECTOR_CONETXT.RESPONSE}`]() {
      return new Reponse()
    },

    /**
     * Inject View
     */
    get [`${INJECTOR_CONETXT.VIEW}`]() {
      return new View()
    },

    /**
     * Inject Redirect
     */
    get [`${INJECTOR_CONETXT.REDIRECT}`]() {
      return new Redirect()
    },

    /**
     * Inject ctx.request.body
     */
    get [`${INJECTOR_CONETXT.BODY}`]() {
      return request.body
    },

    /**
     * Inject ctx.params
     */
    get [`${INJECTOR_CONETXT.PARAMS}`]() {
      return ctx.params
    },

    /**
     * Inject ctx.request.query
     */
    get [`${INJECTOR_CONETXT.QUERY}`]() {
      return request.query
    },

    /**
     * Inject ctx.request.headers
     */
    get [`${INJECTOR_CONETXT.HEADERS}`]() {
      return request.headers
    },

    /**
     * Inject Config
     */
    get [`${INJECTOR_CONETXT.CONFIG}`]() {
      return app.get('config')
    },

    /**
     * Inject App
     */
    get [`${INJECTOR_CONETXT.APP}`]() {
      return app
    },

    /**
     * Inject Messenger
     */
    get [`${INJECTOR_CONETXT.MESSENGER}`]() {
      return app.get('messenger')
    },

    get [`${INJECTOR_CONETXT.AXIOS}`]() {
      return ctx.$http || null
    },


    get [INJECTOR_CONETXT.SERVICE]() {
      return {
        app,
        ctx,
      }
    }
  }
}
