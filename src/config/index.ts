/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import fs from 'fs'
import path from 'path'
import is from 'core-util-is'
import { Container } from '../container'
import { IllegalArgumentError } from '../errors/illegal-argument-error'

const SET_VALUE = Symbol('Config#setValue');
const PARSE = Symbol('Config#parse');

const envMap = new Map([
  ['development', 'dev'],
  ['test', 'test'],
  ['production', 'prod'],
]);

export class ConfigBase {
  _app: any;
  _items: any;
  constructor() {
    /**
     * @var {object} this._app Application
     */
    this._app = Container.get('app');
    /**
     * @var {object} this._items configuration
     * */
    this._items = {};
    // parse configuration files
    // this[PARSE]();
  }

  async initialize() {
    await this[PARSE]();
  }

  /**
   * Parses configuration files to instance properties
   */
  async [PARSE]() {
    const currentEnv = this.env;
    const files = fs.readdirSync(this._app.configPath);

    for (const file of files) {
      if (!~path.basename(file, '.js').indexOf('.')) {
        const currentConfig = await import(path.join(this._app.configPath, file));
        const basename = path.basename(file, '.js');
        if (!this.has(basename)) {
          this.set(basename, currentConfig);
        }
      }

      if (~file.indexOf(`.${currentEnv}.js`)) {
        const currentConfig = await import(path.join(this._app.configPath, file));
        const basename: string = path.basename(file, `.${currentEnv}.js`);
        if (!this.has(basename)) {
          this.set(basename, currentConfig);
        } else {
          const oldConfig = this.get(basename);
          if (is.isObject(oldConfig)) {
            this.set(basename, Object.assign({}, oldConfig, currentConfig));
          } else {
            this.set(basename, currentConfig);
          }
        }
      }
    }
    return this._items;
  }

  /**
   * Sets the property value recursively based on the property name
   */
  [SET_VALUE](names: any[], value: any, index = 0) {
    const res: any = {};
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
   */
  set(name: string, value: any) {
    if (!is.isString(name)) throw new IllegalArgumentError('Config#set name must be String!');
    const names = name.split('.');
    const nameValue = this[SET_VALUE](names, value);
    // Merge configuration attributes
    this._items = Object.assign(this._items, nameValue);
    return this._items;
  }

  /**
   * The name of the configuration
   */
  get(name?: string, def?: any) {
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
    return process.env.DAZE_ENV || (process.env.NODE_ENV && envMap.get(process.env.NODE_ENV)) || process.env.NODE_ENV;
  }
}

/**
 * The agent Config class
 * Implement the attribute operator to get the parameter
 */
export const Config = new Proxy(ConfigBase, {
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
