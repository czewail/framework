/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const is = require('is-type-of');
const Container = require('../container');

const DEFAULT_KEY = 'data';

class Resource {
  /**
   * @var {Application} app Application instance
   */
  app = Container.get('app');

  /**
   * @var {string} key resource data key
   */
  key = DEFAULT_KEY;

  /**
   * @var {mixed} data resource data
   */
  data = null;

  /**
   * @var {function} formatter resource data formatter
   */
  formatter = null;

  /**
   * @var {function} formatter resource meta data formatter
   */
  metaFormatter = null;

  /**
   * @var {mixed} meta resource meta data
   */
  meta = null;

  /**
   * Create Resource
   * @param {mixed} data resource data
   * @param {?function} formatter resource data formatter
   * @param {?string} key resource data key
   */
  constructor(data, formatter = null, key = null) {
    this.data = data;
    if (key) this.key = key;
    if (formatter) this.formatter = formatter;
  }

  /**
   * set resource data formatter
   * @param {function} formatter resource data formatter
   */
  setFormatter(formatter) {
    this.formatter = formatter;
    return this;
  }

  /**
   * get resource data formatter
   */
  getFormatter() {
    return this.formatter;
  }

  /**
   * Resource Key getter
   * @var {string} resource key
   */
  getKey() {
    return this.key;
  }

  /**
   * Resource Key Setter
   * @var {string} resource key
   */
  setKey(val) {
    this.key = val;
    return this;
  }

  /**
   * Resource data getter
   * @var {string} resource data
   */
  getData() {
    return this.data;
  }

  /**
   * Resource data Setter
   * @var {string} resource data
   */
  setData(val) {
    this.data = val;
    return this;
  }

  /**
   * Resource meta getter
   * @var {string} resource meta
   */
  getMeta() {
    return this.meta;
  }

  /**
   * Resource meta Setter
   * @var {string} resource meta
   */
  setMeta(val) {
    this.meta = val;
    return this;
  }

  /**
   * meta formatter formatter getter
   * @var {string} meta formatter
   */
  getMetaFormatter() {
    return this.metaFormatter;
  }

  /**
   * meta formatter formatter setter
   * @var {string} meta formatter
   */
  setMetaFormatter(val) {
    this.metaFormatter = val;
    return this;
  }

  /**
   * add meta object
   * @param {string|object} name meta object key name
   * @param {mixed} value meta value for name key
   * @param {function|string} formatter meta formatter
   */
  addMeta(name, value, formatter = null) {
    if (!this.meta) this.meta = {};
    if (is.object(name)) {
      if (value) this.metaFormatter = value;
      this.meta = Object.assign({}, this.meta, name);
    } else if (is.string(name)) {
      this.metaFormatter = formatter;
      this.meta[name] = value;
    }
    return this;
  }

  /**
   * remove reource key
   */
  withoutKey() {
    this.key = null;
    return this;
  }
}

module.exports = Resource;
