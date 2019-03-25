/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const InjectMeta = require('../foundation/support/meta/inject-meta');
const symbols = require('../symbol');
const { MULTITON } = require('../symbol');

const BIND = Symbol('Container#bind');
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
  singleton(abstract, concrete = null, callable = false) {
    this[BIND](abstract, concrete, true, callable);
    return this;
  }

  /**
   * Bind a multiton to the container
   *
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance
   * @returns {void}
   * @public
   */
  multiton(abstract, concrete = null, callable = false) {
    this[BIND](abstract, concrete, false, callable);
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
    );
  }

  /**
   * Identifies whether the container has been bound
   *
   * @param {mixed} abstract Object identifier
   * @returns {boolean}
   * @public
   */
  bound(abstract) {
    return this.binds.has(abstract) || this.instances.has(abstract);
  }

  /**
   * Identifies whether the container has been instance
   *
   * @param {mixed} abstract Object identifier
   * @public
   */
  exists(abstract) {
    return this.instances.has(abstract);
  }

  /**
   * Bind an object to the container
   *
   * @param {string} abstract Object identifier
   * @param {mixed} concrete The object instance to bind to
   * @returns {Container} this
   * @private
   */
  [BIND](abstract, concrete = null, shared = false, callable = false) {
    if (!abstract || !concrete) return undefined;
    // console.log(concrete)
    if (typeof concrete === 'function' && !callable) {
      // if (isClass(concrete) || (concrete.name && /^[A-Z]+/.test(concrete.name))) {
      this.binds.set(abstract, {
        concrete,
        shared: concrete[MULTITON] === true ? false : shared,
      });
      return this;
    }
    this.instances.set(abstract, {
      concrete,
      shared: true,
    });
    return this;
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
        this.multiton(m[0], m[1]);
      } else {
        this.singleton(m[0], m[1]);
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
    const shared = this.isShared(abstract);
    let obj = null;
    // returns directly if an object instance already exists in the container
    // instance shared
    if (this.instances.has(abstract) && shared && !force) {
      return this.instances.get(abstract).concrete;
    }
    // if a binding object exists, the binding object is instantiated
    if (this.binds.has(abstract)) {
      obj = this.injectClass(abstract, args);
      // obj = Reflect.construct(this.binds.get(abstract).concrete, args)
    }
    // 如果是单例，保存实例到容器
    if (shared && obj) {
      this.instances.set(abstract, {
        concrete: obj,
        shared,
      });
    }
    return obj;
  }

  injectClass(abstract, args) {
    const that = this;
    const klass = this.binds.get(abstract).concrete;
    const bindParams = [];
    // 判断class原型是否需要构造函数注入
    if (InjectMeta.has(symbols.CONSTRUCTOR_INJECTORS, klass.prototype)) {
      // 获取需要注入的标识
      // [ [ type, params ] ]
      const injectors = InjectMeta.get(symbols.CONSTRUCTOR_INJECTORS, klass.prototype) || [];
      for (const [type, params] of injectors) {
        bindParams.push(this.make(type, [...params, ...args]));
      }
    }
    const klassProxy = new Proxy(klass, {
      construct(target, _args, ext) {
        const instance = Reflect.construct(target, _args, ext);
        instance[symbols.INJECT_CONTAINER_ARGS] = args;
        return new Proxy(instance, {
          get(t, name, receiver) {
            if (name === 'constructor') return Reflect.get(t, name, receiver);
            if (typeof t[name] === 'function') {
              return new Proxy(t[name], {
                apply(tar, thisBinding, instanceArgs) {
                  const bindMethodParams = [];
                  if (InjectMeta.has(symbols.METHOD_INJECTORS, t)) {
                    const injectors = InjectMeta.get(symbols.METHOD_INJECTORS, t) || {};
                    const methodInjectors = injectors[name] || [];
                    for (const [type, params] of methodInjectors) {
                      bindMethodParams.push(that.make(type, [...params, ...args]));
                    }
                    return Reflect.apply(tar, thisBinding, [...bindMethodParams, ...instanceArgs]);
                  }
                  return Reflect.apply(tar, thisBinding, instanceArgs);
                },
              });
            }
            if (InjectMeta.has(symbols.PROPERTY_INJECTORS, t)) {
              const injectors = InjectMeta.get(symbols.PROPERTY_INJECTORS, t) || {};
              const [type, params] = injectors[name] || [];
              return type ? that.make(type, [...params, ...args]) : Reflect.get(t, name, receiver);
            }
            return Reflect.get(t, name, receiver);
          },
        });
      },
    });
    return Reflect.construct(klassProxy, [...bindParams, ...args]);
  }

  call(abstract, args = []) {
    const concrete = this.make(abstract);
    if (typeof concrete !== 'function') return undefined;
    return concrete(...args);
  }

  /**
   * set abstract in groups
   * @param {string} abstract Object identifier
   * @param {string} group group name
   */
  static tag(abstract, tag) {
    if (!abstract || !tag) return;
    if (!this.getInstance().tags[tag]) this.getInstance().tags[tag] = [];
    this.getInstance().tags[tag].push(abstract);
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
    return this.getInstance().make(abstract, args);
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
    return this.getInstance()[BIND](abstract, concrete, shared);
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
    return this.getInstance().binds.has(abstract) || this.getInstance().instances.has(abstract);
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
      this.instance = new this();
    }
    return this.instance;
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
    this.instance = instance;
  }
}

Container.instance = null;

module.exports = Container;
