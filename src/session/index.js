/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const coreUtil = require('core-util-is')
const { SESSION_FLASHS, SESSION_FLASHED, SESSION_OLD_INPUT, SESSION_ERRORS } = require('../symbol')

const SET_VALUE = Symbol('Session#setValue')

class Session {
  constructor(ctx) {
    this.ctx = ctx
    this.session = ctx.session
  }

  all() {
    return this.session
  }

  /**
   * get session value by key name
   * @param {string} name key
   * @param {mixed} def default value
   */
  get(name = null, def = null) {
    let value = this.session
    // Gets all the configuration when name is empty
    if (name === null) {
      return value
    }
    const names = name.split('.')
    for (const n of names) {
      if (!coreUtil.isObject(value) || !Reflect.has(value, n)) {
        value = null
        break
      }
      value = value[n]
    }
    return value === null ? def : value
  }

  getOldInput() {
    return this.get(SESSION_OLD_INPUT)
  }

  getErrors() {
    return this.get(SESSION_ERRORS)
  }

  /**
   * set session value by key name
   * @param {string|object} name key
   * @param {mixed} value value
   */
  set(name, value = null) {
    if (typeof name === 'string') { // if name is a string
      const names = name.split('.')
      const nameValue = this[SET_VALUE](names, value)
      // Merge configuration attributes
      this.session = Object.assign(this.session, nameValue)
    } else if (coreUtil.isObject(name)) {
      const keys = Object.keys(name)
      for (const key of keys) {
        const nameValue = this[SET_VALUE]([key], name[key])
        this.session = Object.assign(this.session, nameValue)
      }
    }
    return this.session
  }

  /**
   * Sets the property value recursively based on the property name
   * @param {array} names name array
   * @param {mixed} value set value
   * @param {number} index name in names index
   * @returns {object} name:value object
   */
  [SET_VALUE](names, value, index = 0) {
    const res = {}
    const name = names[index]
    const {
      length
    } = names
    if (length > index + 1) {
      res[name] = this[SET_VALUE](names, value, index + 1)
    } else {
      res[name] = value
    }
    return res
  }

  /**
   * Session sets the next request valid
   * @param {string} name key
   * @param {mixed} value value
   */
  flash(name, value) {
    if (!name || !value) return this
    this.session[name] = value
    if (!coreUtil.isArray(this.session[SESSION_FLASHS])) {
      this.session[SESSION_FLASHS] = []
    }
    this.session[SESSION_FLASHS].push(name)
    this.session[SESSION_FLASHED] = false
  }

  clear() {
    this.session = null
  }
}

const SessionProxy = new Proxy(Session, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended)
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop]
        }
        return t.session[prop]
      },
      set(t, prop, value, receiver) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          Reflect.set(t, prop, value, receiver)
          return true
        }
        t.set(prop, value)
        return true
      }
    })
  }
})

module.exports = SessionProxy
