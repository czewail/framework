/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const EventEmitter = require('events');
const symbols = require('../symbol');

const BIND = Symbol('Container#bind');
/**
 * The Container
 */
class Container extends EventEmitter {
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
   * @param {*} concrete The object instance
   * @param {Boolean} [callable=false] Generic Functions
   * @returns {this}
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
   * @param {*} concrete The object instance
   * @param {Boolean} [callable=false] Generic Functions
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
      this.binds.get(abstract)
      && Reflect.has(this.binds.get(abstract), 'shared')
      && this.binds.get(abstract).shared === true
    );
  }

  /**
   * Identifies whether the container has been bound
   *
   * @param {*} abstract Object identifier
   * @returns {boolean}
   * @public
   */
  bound(abstract) {
    return this.binds.has(abstract) || this.instances.has(abstract);
  }

  /**
   * Identifies whether the container has been instance
   *
   * @param {*} abstract Object identifier
   * @public
   */
  exists(abstract) {
    return this.instances.has(abstract);
  }

  /**
   * Bind an object to the container
   *
   * @param {string} abstract Object identifier
   * @param {*} concrete The object instance to bind to
   * @param {Boolean} [shared=false] forced instantiation
   * @param {Boolean} [callable=false] Generic Functions
   * @returns {Container} this
   * @private
   */
  [BIND](abstract, concrete = null, shared = false, callable = false) {
    if (!abstract || !concrete) return undefined;
    const isShared = concrete[symbols.MULTITON] === true ? false : shared;
    if (typeof concrete === 'function') {
      this.binds.set(abstract, {
        concrete,
        shared: isShared,
        callable,
      });
      return this;
    }
    this.instances.set(abstract, {
      concrete,
      shared: true,
      callable,
    });
    this.emit('binding', this.instances.get(abstract), this);
    return this;
  }

  /**
   * Bind multiple dependencies to the container
   *
   * @param {Array} mapArray multiple dependencies array
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
      const { concrete, callable } = this.binds.get(abstract);
      if (callable) {
        // 普通函数
        obj = this.invokeFunction(abstract, args);
      } else if (Reflect.getMetadata(symbols.INJECT_ABLE, concrete.prototype) === true) {
        // 可注入的class
        obj = this.invokeInjectAbleClass(abstract, args);
      } else {
        // 构造函数（class 和 function）
        obj = this.invokeConstructor(abstract, args);
      }
      this.emit('resolving', obj, this);
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

  /**
   * 调用普通函数
   */
  invokeFunction(abstract, args) {
    const { concrete } = this.binds.get(abstract);
    return concrete(...args, this);
  }

  /**
   * 调用构造函数
   */
  invokeConstructor(abstract, args) {
    const { concrete: Concrete } = this.binds.get(abstract);
    return new Concrete(...args, this);
  }

  /**
   * 调用可注入的 Class
   */
  invokeInjectAbleClass(abstract, args) {
    const { concrete: Concrete } = this.binds.get(abstract);
    const that = this;
    const bindParams = [];
    // 需要构造方法注入参数
    const constructorInjectors = Reflect.getMetadata(
      symbols.INJECTABLE_KINDS.CONSTRUCTOR, Concrete.prototype,
    ) || [];
    // 需要成员方法注入参数
    const methodInjectors = Reflect.getMetadata(
      symbols.INJECTABLE_KINDS.METHOD, Concrete.prototype,
    ) || {};
    // 需要成员变量注入参数
    const propertyInjectors = Reflect.getMetadata(
      symbols.INJECTABLE_KINDS.PROPERTY, Concrete.prototype,
    ) || {};

    for (const [type, params = []] of constructorInjectors) {
      const injectedParam = this.make(type, [...params, ...args]);
      bindParams.push(injectedParam);
    }
    const ConcreteProxy = new Proxy(Concrete, {
      construct(_target, _args, _ext) {
        const instance = Reflect.construct(_target, _args, _ext);
        instance.__context__ = args;
        return new Proxy(instance, {
          get(__target, __name, __receiver) {
            if (__name === 'name' || __name === 'constructor' || typeof __name === 'symbol') return Reflect.get(__target, __name, __receiver);
            if (typeof __target[__name] === 'function') {
              return new Proxy(__target[__name], {
                apply(target, thisBinding, methodArgs) {
                  const bindMethodParams = [];
                  const methodParams = methodInjectors[__name] || [];
                  for (const [type, params = []] of methodParams) {
                    const injectedParam = that.make(type, [...params, ...args]);
                    bindMethodParams.push(injectedParam);
                  }
                  return Reflect.apply(target, thisBinding, [...bindMethodParams, ...methodArgs]);
                },
              });
            }
            const [type, params = []] = propertyInjectors[__name] || [];
            return type
              ? that.make(type, [...params, ...args])
              : Reflect.get(__target, __name, __receiver);
          },
        });
      },
    });
    return Reflect.construct(ConcreteProxy, [...bindParams, ...args, this]);
  }

  /**
   * set abstract in groups
   * @param {string} abstract Object identifier
   * @param {string} tag group name
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
   * @returns {*} instance
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
   * @param {array} concrete
   * @param {boolean} shared forced instantiation
   * @param {boolean} [callable=false] Generic Functions
   * @returns {*} instance
   * @public
   * @static
   */
  static bind(abstract, concrete = null, shared = true, callable = false) {
    return this.getInstance()[BIND](abstract, concrete, shared, callable);
  }

  /**
   * Determines whether there is a corresponding binding within the container instance
   *
   * @param {*} abstract Object identifier
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
