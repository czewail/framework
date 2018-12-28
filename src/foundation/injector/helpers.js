/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path')
// const _ = require('lodash')

/**
 * getService
 * @param {object} injector app
 * @param {array} args services
 */
exports.getService = function (injector, args) {
  if (args.length === 0) return null
  const param = args[0] || []
  if (typeof param === 'string') {
    const serviceFilePath = path.join(injector.app.servicePath, `${param}.js`)
    if (require.resolve(serviceFilePath)) {
      const ServiceClass = require(serviceFilePath)
      const res = require('../injector/factory')(ServiceClass, injector.ctx)
      return res
    }
  } else if (Array.isArray(param)) {
    const res = []
    for (const serviceName of param) {
      const serviceFilePath = path.join(injector.app.servicePath, `${serviceName}.js`)
      if (require.resolve(serviceFilePath)) {
        const ServiceClass = require(serviceFilePath)
        require('../injector/factory')(ServiceClass, injector.ctx, (serviceInstance) => {
          res.push(serviceInstance)
          // _.set(res, serviceName.split('/').join('.'), serviceInstance)
        })
      }
    }
    return res
  }
  return null
}

/**
 * getRequest
 * @param {*} injector Request
 * @param {array} args request args
 */
exports.getRequest = function (injector, args) {
  return args.length > 0 ? injector.param(...args) : injector
}

exports.getQuery = function (query, args) {
  const arg = args[0] || null
  if (arg) {
    if (typeof arg === 'string') {
      return query[arg] || null
    } else if (Array.isArray(arg)) {
      const res = {}
      for (const s of arg) {
        if (Reflect.has(query, s)) res[s] = query[s]
      }
      return res
    }
  }
  return query
}

exports.getCookie = function (getCookie, args) {
  const arg = args[0] || null
  const options = args[1] || {}
  if (!arg) return null
  if (typeof arg === 'string') {
    return getCookie(arg, options)
  } else if (Array.isArray(arg)) {
    const res = []
    for (const s of arg) {
      res.push(getCookie(s, options))
    }
    return res
  }
  return null
}
