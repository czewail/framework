// @ts-check
/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const path = require('path');
const fs = require('fs');
const is = require('core-util-is');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

const SET_VALUE = Symbol('Config#setValue');
const PARSE = Symbol('Config#parse');

const envMap = new Map([
  ['development', 'dev'],
  ['test', 'test'],
  ['production', 'prod'],
]);

/**
 * @class
 */
class Config {
  constructor() {
    /**
     * @type {import('../foundation/application')} _app Application
     */
    this._app = Container.get('app');

    /**
     * @var this._items configuration
     * */
    this._items = {};
    // parse configuration files
    this[PARSE]();
  }

  /**
   * Parses configuration files to instance properties
   */
  [PARSE]() {
    const currentEnv = this.env;
    const files = fs.readdirSync(this._app.configPath);
    // Read a configuration file whose name does not contain '.'
    files.filter((file) => !~path.basename(file, path.extname(file)).indexOf('.'))
      .forEach((file) => {
        // eslint-disable-next-line
        const currentConfig = require(path.join(this._app.configPath, file));
        const basename = path.basename(file, path.extname(file));
        if (!this.has(basename)) {
          this.set(basename, currentConfig);
        }
      });
    // Read the configuration file that contains '.'
    files.filter((file) => ~file.indexOf(`.${currentEnv}${path.extname(file)}`))
      .forEach((file) => {
        // eslint-disable-next-line
        const currentConfig = require(path.join(this._app.configPath, file));
        const basename = path.basename(file, `.${currentEnv}${path.extname(file)}`);
        if (!this.has(basename)) {
          this.set(basename, currentConfig);
        } else {
          const oldConfig = this.get(basename);
          if (is.isObject(oldConfig)) {
            this.set(basename, { ...oldConfig, ...currentConfig });
          } else {
            this.set(basename, currentConfig);
          }
        }
      });
    return this._items;
  }

  /**
   * Sets the property value recursively based on the property name
   * @param {array} names name array
   * @param {*} value set value
   * @param {number} index name in names index
   * @returns {object} name:value object
   */
  [SET_VALUE](names, value, index = 0) {
    const res = {};
    const name = names[index];
    const {
      length,
    } = names;
    if (length > index + 1) {
      res[name] = this[SET_VALUE](names, value, index + 1);
    } else {
      res[name] = value;
    }
    return res;
  }

  /**
   * Set the property value according to the property name
   * @param {string} name name,  string
   * @param {any} value set value
   * @returns {object} this._items
   */
  set(name, value = null) {
    if (!is.isString(name)) throw new IllegalArgumentError('Config#set name must be String!');
    const names = name.split('.');
    const nameValue = this[SET_VALUE](names, value);
    // Merge configuration attributes
    this._items = Object.assign(this._items, nameValue);
    return this._items;
  }

  /**
   * The name of the configuration
   * @param {string} [name] The name of the configuration
   * @param {any} [def] The default configuration
   */
  get(name, def) {
    let value = this._items;
    // Gets all the configuration when name is empty
    if (!name) {
      return value;
    }
    const names = name.split('.');
    for (const n of names) {
      if (!Reflect.has(value, n)) {
        value = undefined;
        break;
      }
      value = value[n];
    }
    return value === undefined ? def : value;
  }

  /**
   * Determine whether the configuration exists
   * @param {string} name The name of the configuration
   * @returns {boolean} configuration exists
   */
  has(name = '') {
    if (!name) {
      return false;
    }
    return !(this.get(name) === undefined);
  }

  /**
   * current env getter
   */
  get env() {
    return process.env.DAZE_ENV || envMap.get(process.env.NODE_ENV) || process.env.NODE_ENV;
  }
}

/**
 * The agent Config class
 * Implement the attribute operator to get the parameter
 */
const configProxy = new Proxy(Config, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended);
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop];
        }
        return t.get(prop);
      },
    });
  },
});

module.exports = configProxy;
