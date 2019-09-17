/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import is from 'core-util-is'
import { Container } from '../container'

const DEFAULT_KEY = 'data';

export class Resource {
  /**
   * @var app Application instance
   */
  app = Container.get('app');

  /**
   * @var key resource data key
   */
  key = DEFAULT_KEY;

  /**
   * @var data resource data
   */
  data: any = null;

  /**
   * @var formatter resource data formatter
   */
  formatter: any = null;

  /**
   * @var formatter resource meta data formatter
   */
  metaFormatter: any = null;

  /**
   * @var meta resource meta data
   */
  meta: any = null;

  /**
   * resource type
   */
  type: any = null;

  /**
   * Create Resource
   */
  constructor(data: any, formatter: any = null, key: any = null) {
    this.data = data;
    if (key) this.key = key;
    if (formatter) this.formatter = formatter;
  }

  /**
   * set resource data formatter
   * @param formatter resource data formatter
   */
  setFormatter(formatter: any) {
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
   * @var resource key
   */
  setKey(val: string) {
    this.key = val;
    return this;
  }

  /**
   * Resource data getter
   */
  getData() {
    return this.data;
  }

  /**
   * Resource data Setter
   */
  setData(val: any) {
    this.data = val;
    return this;
  }

  /**
   * Resource meta getter
   */
  getMeta() {
    return this.meta;
  }

  /**
   * Resource meta Setter
   * @var resource meta
   */
  setMeta(val: any) {
    this.meta = val;
    return this;
  }

  /**
   * meta formatter formatter getter
   */
  getMetaFormatter() {
    return this.metaFormatter;
  }

  /**
   * meta formatter formatter setter
   * @var meta formatter
   */
  setMetaFormatter(val: any) {
    this.metaFormatter = val;
    return this;
  }

  /**
   * add meta object
   * @param name meta object key name
   * @param value meta value for name key
   */
  addMeta(name: any, value: any) {
    if (!this.meta) this.meta = {};
    if (is.isObject(name)) {
      this.meta = Object.assign({}, this.meta, name);
    } else if (is.isString(name)) {
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

  /**
   * transform resource meta object
   */
  transformResourceMeta() {
    return this.useTransformer(this.metaFormatter, this.meta);
  }

  /**
   * transform resource data object or array
   */
  transformResourceData() {
    if (this.type === 'item') {
      return this.useTransformer(this.formatter, this.data);
    }
    if (this.type === 'collection') {
      return this.data.map((i: any) => this.useTransformer(this.formatter, i));
    }
    return this.data;
  }

  /**
   * use tansformer transform data or meta
   * @param formatter resource formatter
   * @param data resource meta or data
   */
  useTransformer(formatter: any, data: any) {
    if (!data) return null;
    // 如果是字符串
    if (typeof formatter === 'string') {
      const Transformer = this.app.get(`resource.${formatter}`);
      return Transformer.resolve(data);
    }
    // 如果是回调函数
    if (typeof formatter === 'function') {
      return formatter(data);
    }
    return data;
  }

  /**
    * serialize Rource data
    * @param {boolean} isWrapCollection is collection use wrap key
    */
  serializeResourceData(isWrapCollection = true) {
    const data = this.transformResourceData();
    if (this.type === 'collection') {
      if (this.key) {
        return {
          [this.key]: data,
        };
      }
      return isWrapCollection ? {
        data,
      } : data;
    }
    if (this.type === 'item') {
      if (this.key) {
        return {
          [this.key]: data,
        };
      }
      return data;
    }
    if (this.key) {
      return {
        [this.key]: null,
      };
    }
    return null;
  }

  /**
    * serialize resource meta
    */
  serializeResourceMeta() {
    const meta = this.transformResourceMeta();
    return meta ? {
      meta,
    } : null;
  }

  /**
   * transform data
   */
  transform() {
    const data = this.serializeResourceData();
    const meta = this.serializeResourceMeta();

    if (meta) {
      return { data, meta };
    }
    return data;
  }

  /**
   * output result
   */
  output() {
    return this.transform();
  }
}
