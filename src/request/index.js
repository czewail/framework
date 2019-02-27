/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Validate = require('../validate')
const ValidateError = require('../errors/validate-error')
const Session = require('../session')

const GET_MERGED_PARAMS = Symbol('Request#getMergedParams')

class Request {
  sess = null;

  constructor(req) {
    this.request = req
    this.mergedParams = this[GET_MERGED_PARAMS]()
  }

  /**
   * Determine if the request is the result of an AJAX call.
   */
  get isAjax() {
    const x = this.request.headers['x-requested-with']
    if (x && x.toLowerCase() === 'xmlhttprequest') {
      return true
    }
    return false
  }

  get expectsJson() {
    return this.isAjax || !!this.ctx.accepts('json')
  }

  /**
   * Gets the parameter value based on the parameter name
   * Returns the default value when the parameter does not exist
   * @param {string} name Parameter name
   * @param {mixed} defaultValue default parameter value
   */
  param(name, defaultValue = null) {
    if (name) {
      return this.has(name) ? this.mergedParams[name] : defaultValue
    }
    return this.mergedParams
  }

  /**
   * Filter parameters
   * @param {string} names An array of parameter names
   */
  only(...args) {
    const res = {}
    for (const arg of args) {
      if (typeof arg === 'string') {
        if (this.has(arg)) {
          res[arg] = this.param(arg)
        }
      } else if (Array.isArray(arg)) {
        for (const name of arg) {
          if (this.has(name)) {
            res[name] = this.param(name)
          }
        }
      }
    }
    return res
  }


  /**
   * Filter parameters
   * @param {string} names An array of parameter names
   */
  except(...args) {
    let exceptKeys = []
    let keys = Object.keys(this.param())
    for (const arg of args) {
      if (typeof arg === 'string') {
        exceptKeys.push(arg)
      } else if (Array.isArray(arg)) {
        exceptKeys = exceptKeys.concat(arg)
      }
    }
    keys = keys.filter(key => !~exceptKeys.indexOf(key))
    return this.only(keys)
  }

  /**
   * Determine whether the parameter exists
   * @param {string} name Parameter name
   */
  has(name) {
    return Reflect.has(this.mergedParams, name)
  }

  /**
   * Consolidation parameters
   */
  [GET_MERGED_PARAMS]() {
    return Object.assign(this.ctx.params || {}, this.request.query, this.request.body)
  }

  /**
   * validate request
   * @param {object} validator validator
   * @param {string} message message
   */
  validate(validator, message = 'Validation error') {
    const validate = new Validate(this[GET_MERGED_PARAMS](), validator)
    if (validate.fails) {
      throw new ValidateError(message, validate)
    }
  }

  session() {
    if (!this.sess) this.sess = new Session(this.ctx)
    return this.sess
  }

  cookie(...params) {
    return this.getCookie(...params)
  }

  getCookie(key, options = {}) {
    return this.ctx.cookies.get(key, options)
  }

  getHeader(name) {
    return this.request.header[name]
  }
}

/**
 * The agent Request class
 * Implement the attribute operator to get the parameter
 */
const requestProxy = new Proxy(Request, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended)
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop]
        }
        if (Reflect.has(t.request, prop)) {
          return t.request[prop]
        }
        return t.param(prop)
      },
    })
  },
})


module.exports = requestProxy
