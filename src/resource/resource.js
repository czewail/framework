/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const is = require('is-type-of')
const Container = require('../container')

const DATA = Symbol('Resource#data')
const KEY = Symbol('Resource#key')
const META = Symbol('Resource#meta')
const FORMATTER = Symbol('Resource#formatter')
const META_FORMATTER = Symbol('Resource#metaFormatter')
const DEFAULT_KEY = 'data'

class Resource {
  constructor(data, formatter = null, key = DEFAULT_KEY) {
    this[DATA] = data
    this[KEY] = key
    this[META] = null
    this[FORMATTER] = formatter
    this[META_FORMATTER] = null
    this.app = Container.get('app')
  }

  setFormatter(formatter) {
    this[FORMATTER] = formatter
    return this
  }

  /**
   * Resource Key getter
   * @var {string} resource key
   */
  get key() {
    return this[KEY]
  }

  /**
   * Resource Key Setter
   * @var {string} resource key
   */
  set key(val) {
    this[KEY] = val
  }

  /**
   * Resource data getter
   * @var {string} resource data
   */
  get data() {
    return this[DATA]
  }

  /**
   * Resource data Setter
   * @var {string} resource data
   */
  set data(val) {
    this[DATA] = val
  }

  /**
   * Resource meta getter
   * @var {string} resource meta
   */
  get meta() {
    return this[META]
  }

  /**
   * Resource meta Setter
   * @var {string} resource meta
   */
  set meta(val) {
    this[META] = val
  }

  /**
   * Resource formatter getter
   * @var {string} resource formatter
   */
  get formatter() {
    return this[FORMATTER]
  }

  /**
   * Resource formatter Setter
   * @var {string} resource formatter
   */
  set formatter(val) {
    this[FORMATTER] = val
  }

  /**
   * meta formatter formatter getter
   * @var {string} meta formatter
   */
  get metaFormatter() {
    return this[META_FORMATTER]
  }

  /**
   * meta formatter formatter setter
   * @var {string} meta formatter
   */
  set metaFormatter(val) {
    this[META_FORMATTER] = val
  }

  /**
   * setKey
   * @param {*} key resource key
   */
  setKey(key) {
    this.key = key
    return this
  }

  /**
   * add meta object
   * @param {string|object} name meta object key name
   * @param {mixed} value meta value for name key
   * @param {function|string} formatter meta formatter
   */
  addMeta(name, value, formatter = null) {
    if (!this.meta) this.meta = {}
    if (is.object(name)) {
      this[META_FORMATTER] = value
      this.meta = Object.assign({}, this.meta, name)
    } else if (is.string(name)) {
      this[META_FORMATTER] = formatter
      this.meta[name] = value
    }
    return this
  }

  /**
   * remove reource key
   */
  withoutKey() {
    this.key = null
    return this
  }
}

module.exports = Resource
