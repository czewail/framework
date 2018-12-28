/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { INJECTOR_CONETXT } = require('../../symbol')
const helpers = require('./helpers')

/**
 * Inject the object according to the parameter transformation
 * @param {object} injectorContext injector context
 * @param {array} controllerInjector controller injector params
 * @param {string} type inject type
 */
module.exports = function (injectorContext, params, type) {
  const injector = injectorContext[type] || null
  switch (type) {
    case INJECTOR_CONETXT.REQUEST:
      return helpers.getRequest(injector, params, injectorContext)
    case INJECTOR_CONETXT.SERVICE:
      return helpers.getService(injector, params)
    case INJECTOR_CONETXT.QUERY:
      return helpers.getQuery(injector, params)
    case INJECTOR_CONETXT.COOKIE:
      return helpers.getCookie(injector, params)
    default:
      return injector
  }
}
