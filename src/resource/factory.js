/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path')
const Container = require('../container')
const Collection = require('./collection')
const Item = require('./item')

class Factory {
  constructor(resource) {
    this.resource = resource
    this.app = Container.get('app')
  }

  /**
   * transform resource meta object
   * @param {object} resource resource instance
   */
  transformResourceMeta(resource) {
    const { metaFormatter, meta } = resource
    return this.useTransformer(metaFormatter, meta)
  }

  /**
   * transform resource data object or array
   * @param {object} resource resource instance
   */
  transformResourceData(resource) {
    const { formatter, data } = resource
    if (resource instanceof Item) {
      return this.useTransformer(formatter, data)
    }
    if (resource instanceof Collection) {
      return data.map(i => this.useTransformer(formatter, i))
    }
    return data
  }

  /**
   * use tansformer transform data or meta
   * @param {string|function} formatter resource formatter
   * @param {object|array} data resource meta or data
   */
  useTransformer(formatter, data) {
    if (!data) return null
    // 如果是字符串
    if (typeof formatter === 'string') {
      const transformerFileName = this.getTransformerFilePath(formatter)
      const transformerPath = path.join(this.app.transformerPath, transformerFileName)
      const Transformer = this.app.craft(transformerPath)
      return Transformer.toJSON(data)
    }
    // 如果是回调函数
    if (typeof formatter === 'function') {
      return formatter(data)
    }
    return data
  }

  /**
  * get ttansfromer file path
  * @param {string} formatter formatter value (filename)
  */
  getTransformerFilePath(formatter) {
    return formatter.slice(-3) === '.js' ? formatter : `${formatter}.js`
  }

  /**
   * serialize Rource data
   * @param {boolean} isWrapCollection is collection use wrap key
   */
  serializeResourceData(isWrapCollection = true) {
    const { key } = this.resource

    const data = this.transformResourceData(this.resource)

    if (this.resource instanceof Collection) {
      if (key) return { [key]: data }
      return isWrapCollection ? { data } : data
    }
    if (this.resource instanceof Item) {
      if (key) return { [key]: data }
      return data
    }
    if (key) return { [key]: null }
    return null
  }

  /**
   * serialize resource meta
   */
  serializeResourceMeta() {
    const meta = this.transformResourceMeta(this.resource)
    return meta ? { meta } : null
  }

  /**
   * output result
   */
  output() {
    const data = this.serializeResourceData()
    const meta = this.serializeResourceMeta()
    return Object.assign({}, data, meta)
  }
}

module.exports = Factory
