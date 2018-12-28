/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const is = require('is-type-of')
const { MULTITON } = require('../symbol')

// const f = require('../decorators')
// f.

const BIND = Symbol('Container#bind')
/**
 * The Container
 */
class Container {
  /**
   * The constructor
   */
  constructor() {
    /**
     * Container binding identifier
     */
    this.binds = new Map([
      ['app', {
        concrete: require('../foundation/application'),
        shared: true,
      }],
      ['config', {
        concrete: require('../config'),
        shared: true,
      }],
      ['router', {
        concrete: require('koa-router'),
        shared: true,
      }],
      ['koa', {
        concrete: require('koa'),
        shared: true,
      }],
      ['messenger', {
        concrete: require('../cluster/messenger'),
        shared: true,
      }],
      ['logger', {
        concrete: require('../logger'),
        shared: true,
      }],
    ])
    /**
     * instances Map in the container
     */
    this.instances = new Map()
  }

  /**
   * Bind a singleton to the container
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance
   */
  singleton(abstract, concrete = null) {
    this[BIND](abstract, concrete, true)
  }

  /**
   * Bind a multiton to the container
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance
   */
  multiton(abstract, concrete = null) {
    this[BIND](abstract, concrete, false)
  }

  /**
   * Determines if the instance is Shared
   * @param {string} abstract Object identifier
   */
  isShared(abstract) {
    return this.instances.has(abstract) || (
      this.binds.get(abstract) && Reflect.has(this.binds.get(abstract), 'shared') && this.binds.get(abstract).shared === true
    )
  }

  /**
   * Identifies whether the container has been bound
   * @param {mixed} abstract Object identifier
   */
  bound(abstract) {
    return this.binds.has(abstract) || this.instances.has(abstract)
  }

  /**
   * Identifies whether the container has been instance
   * @param {mixed} abstract Object identifier
   */
  exists(abstract) {
    return this.instances.has(abstract)
  }

  /**
   * Bind an object to the container
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance to bind to
   */
  [BIND](abstract, concrete = null, shared = false) {
    if (!abstract || !concrete) return
    // console.log(concrete)
    if (typeof concrete === 'function') {
      // class 和首字母大写的函数，则视为构造函数
      if (is.class(concrete) || /^[A-Z]+/.test(concrete.name)) {
        // If it's a constructor
        this.binds.set(abstract, {
          concrete,
          shared: concrete[MULTITON] === true ? false : shared,
        })
      } else {
        this.instances.set(abstract, {
          concrete,
          shared,
        })
      }
    } else {
      // others
      this.instances.set(abstract, {
        concrete,
        shared,
      })
    }
    return this
  }

  /**
   * Bind multiple dependencies to the container
   * @param {MapArray} mapArray multiple dependencies array
   */
  setBinds(mapArray) {
    for (const m of mapArray) {
      if (m[2] === false) {
        this.multiton(m[0], m[1])
      } else {
        this.singleton(m[0], m[1])
      }
    }
  }

  /**
   * Create an instance of an object
   * @param {string} abstract Object identifier
   * @param {array} args params
   * @param {boolean} force forced instantiation
   */
  make(abstract, args = [], force = false) {
    const shared = this.isShared(abstract)
    let obj = null
    // returns directly if an object instance already exists in the container
    // instance shared
    if (this.instances.has(abstract) && shared && !force) {
      return this.instances.get(abstract).concrete
    }
    // if a binding object exists, the binding object is instantiated
    if (this.binds.has(abstract)) {
      obj = Reflect.construct(this.binds.get(abstract).concrete, args)
    }
    // 如果是单例，保存实例到容器
    if (shared && obj) {
      this.instances.set(abstract, {
        concrete: obj,
        shared,
      })
    }
    return obj
  }

  /**
   * gets the object instance in the container
   * @param {string} abstract class name or identif∂ier
   * @param {array} args params
   */
  static get(abstract, args = []) {
    return this.getInstance().make(abstract, args)
  }

  /**
   * bind an abstract in container
   * @param {string} abstract Object identifier
   * @param {array} args params
   * @param {boolean} shared forced instantiation
   */
  static bind(abstract, concrete = null, shared = true) {
    return this.getInstance()[BIND](abstract, concrete, shared)
  }

  /**
   * Determines whether there is a corresponding binding within the container instance
   * @param {mixed} abstract Object identifier
   */
  static has(abstract) {
    return this.getInstance().binds.has(abstract) || this.getInstance().instances.has(abstract)
  }

  /**
   * Get the container instance
   * @returns {object} container instance
   */
  static getInstance() {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  /**
   * Set the container instance
   * @param {object} instance container instance
   */
  static setInstance(instance) {
    this.instance = instance
  }
}

Container.instance = null

module.exports = Container
