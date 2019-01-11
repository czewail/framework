/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const fs = require('fs')
const path = require('path')
const is = require('is-type-of')
const Container = require('../container')
// const debug = require('debug')('daze-framework:config')

const SET_VALUE = Symbol('Config#setValue')
const PARSE = Symbol('Config#parse')

const envMap = new Map([
  ['development', 'dev'],
  ['test', 'test'],
  ['production', 'prod'],
])

class Config {
  app = Container.get('app');

  /** @type {object} this.items configuration */
  items = {};

  constructor() {
    // parse configuration files
    this[PARSE]()
  }

  /**
   * Parses configuration files to instance properties
   */
  [PARSE]() {
    const currentEnv = this.env
    // 读取名称不包含 '.' 的配置文件
    fs
      .readdirSync(this.app.configPath).filter(file => !~path.basename(file, '.js').indexOf('.'))
      .forEach(file => {
        const currentConfig = require(path.join(this.app.configPath, file))
        const basename = path.basename(file, '.js')
        if (!this.has(basename)) {
          this.set(basename, currentConfig)
        }
      })
    // 读取包含 '.' 的配置文件
    fs
      .readdirSync(this.app.configPath).filter(file => ~file.indexOf(`.${currentEnv}.js`))
      .forEach(file => {
        const currentConfig = require(path.join(this.app.configPath, file))
        const basename = path.basename(file, `.${currentEnv}.js`)
        if (!this.has(basename)) {
          this.set(basename, currentConfig)
        } else {
          const oldConfig = this.get(basename)
          if (is.object(oldConfig)) {
            this.set(basename, Object.assign({}, oldConfig, currentConfig))
          } else {
            this.set(basename, currentConfig)
          }
        }
      })
    return this.items
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
   * Set the property value according to the property name
   * @param {array|string} name name,  array or string
   * @param {mixed} value set value
   * @returns {object} this.items
   */
  set(name, value = null) {
    if (typeof name === 'string') { // if name is a string
      const names = name.split('.')
      const nameValue = this[SET_VALUE](names, value)
      // Merge configuration attributes
      this.items = Object.assign(this.items, nameValue)
    } else if (Array.isArray(name)) { // if name is a array
      for (const n of name) {
        const names = n.split('.')
        const nameValue = this[SET_VALUE](names, value)
        // Merge configuration attributes
        this.items = Object.assign(this.items, nameValue)
      }
    }
    return this.items
  }

  /**
   * The name of the configuration
   * @param {string} name The name of the configuration
   * @param {mixed} def The default configuration
   */
  get(name = null, def = null) {
    let value = this.items
    // Gets all the configuration when name is empty
    if (name === null) {
      return value
    }
    const names = name.split('.')
    for (const n of names) {
      if (!Reflect.has(value, n)) {
        value = null
        break
      }
      value = value[n]
    }
    return value === null ? def : value
  }

  /**
   * Determine whether the configuration exists
   * @param {string} name The name of the configuration
   * @returns {boolean} configuration exists
   */
  has(name = '') {
    if (!name) {
      return false
    }
    return !(this.get(name) === null)
  }

  get env() {
    return process.env.DAZE_ENV || envMap.get(process.env.NODE_ENV) || process.env.NODE_ENV
  }
}

/**
 * The agent Config class
 * Implement the attribute operator to get the parameter
 */
const configProxy = new Proxy(Config, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended)
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop]
        }
        if (typeof t[prop] === 'function') return t[name].bind(Config)
        return t.get(prop)
      },
    })
  },
})


module.exports = configProxy
