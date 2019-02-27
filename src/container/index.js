/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const isClass = require('node-is-class')
const { MULTITON } = require('../symbol')

const BIND = Symbol('Container#bind')
/**
 * The Container
 */
class Container {
  /**
   * Container binding identifier
   *
   * @var {Map}
   */
  binds = new Map();

  /**
   * instances Map in the container
   *
   * @var {Map}
   */
  instances = new Map();

  /**
   * abstract groups map
   */
  tags = {};

  /**
   * Bind a singleton to the container
   *
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance
   * @returns {void}
   * @public
   */
  singleton(abstract, concrete = null) {
    this[BIND](abstract, concrete, true)
    return this
  }

  /**
   * Bind a multiton to the container
   *
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance
   * @returns {void}
   * @public
   */
  multiton(abstract, concrete = null) {
    this[BIND](abstract, concrete, false)
  }

  /**
   * Determines if the instance is Shared
   *
   * @param {string} abstract Object identifier
   * @returns {boolean}
   * @public
   */
  isShared(abstract) {
    return this.instances.has(abstract) || (
      this.binds.get(abstract) && Reflect.has(this.binds.get(abstract), 'shared') && this.binds.get(abstract).shared === true
    )
  }

  /**
   * Identifies whether the container has been bound
   *
   * @param {mixed} abstract Object identifier
   * @returns {boolean}
   * @public
   */
  bound(abstract) {
    return this.binds.has(abstract) || this.instances.has(abstract)
  }

  /**
   * Identifies whether the container has been instance
   *
   * @param {mixed} abstract Object identifier
   * @public
   */
  exists(abstract) {
    return this.instances.has(abstract)
  }

  /**
   * Bind an object to the container
   *
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance to bind to
   * @returns {Container} this
   * @private
   */
  [BIND](abstract, concrete = null, shared = false) {
    if (!abstract || !concrete) return
    // console.log(concrete)
    if (typeof concrete === 'function') {
      // class 和首字母大写的函数，则视为构造函数
      if (isClass(concrete) || (concrete.name && /^[A-Z]+/.test(concrete.name))) {
        // If it's a constructor
        this.binds.set(abstract, {
          concrete,
          shared: concrete[MULTITON] === true ? false : shared,
        })
      } else {
        this.instances.set(abstract, {
          concrete,
          shared: true,
        })
      }
    } else {
      // others
      this.instances.set(abstract, {
        concrete,
        shared: true,
      })
    }
    return this
  }

  /**
   * Bind multiple dependencies to the container
   *
   * @param {MapArray} mapArray multiple dependencies array
   * @returns {void}
   * @public
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
   * @returns {Container} this
   * @public
   */
  make(abstract, args = [], force = false) {
    const shared = this.isShared(abstract)
    let obj = null
    // returns directly if an object instance already exists in the container
    // instance shared
    if (this.instances.has(abstract) && shared && !force) {
      const concrete = this.instances.get(abstract).concrete
      // if (typeof concrete === 'function') {
      //   return concrete(...args)
      // }
      return concrete
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

  call(abstract, args = []) {
    const concrete = this.make(abstract)
    if (typeof concrete !== 'function') return
    return concrete(...args)
  }

  /**
   * set abstract in groups
   * @param {string} abstract Object identifier
   * @param {string} group group name
   */
  static tag(abstract, tag) {
    if (!abstract || !tag) return
    if (!this.getInstance().tags[tag]) this.getInstance().tags[tag] = []
    this.getInstance().tags[tag].push(abstract)
  }

  /**
   * gets the object instance in the container
   *
   * @param {string} abstract class name or identif∂ier
   * @param {array} args params
   * @returns {mixed} instance
   * @public
   * @static
   */
  static get(abstract, args = []) {
    return this.getInstance().make(abstract, args)
  }

  /**
   * bind an abstract in container
   *
   * @param {string} abstract Object identifier
   * @param {array} args params
   * @param {boolean} shared forced instantiation
   * @returns {mixed} instance
   * @public
   * @static
   */
  static bind(abstract, concrete = null, shared = true) {
    return this.getInstance()[BIND](abstract, concrete, shared)
  }

  /**
   * Determines whether there is a corresponding binding within the container instance
   *
   * @param {mixed} abstract Object identifier
   * @returns {boolean} has abstract
   * @public
   * @static
   */
  static has(abstract) {
    return this.getInstance().binds.has(abstract) || this.getInstance().instances.has(abstract)
  }

  /**
   * Get the container instance
   *
   * @returns {object} container instance
   * @public
   * @static
   */
  static getInstance() {
    if (this.instance === null) {
      this.instance = new this()
    }
    return this.instance
  }

  /**
   * Set the container instance
   *
   * @param {object} instance container instance
   * @returns {void}
   * @public
   * @static
   */
  static setInstance(instance) {
    this.instance = instance
  }
}

Container.instance = null

module.exports = Container
