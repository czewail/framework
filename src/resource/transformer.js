/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Collection = require('./collection')
const Item = require('./item')
const ResourceFactory = require('./factory')

class Transformer {
  collection(data, formatter, key = null) {
    const res = new Collection(data, formatter, key)
    return (new ResourceFactory(res)).serializeResourceData(false)
  }

  item(data, formatter, key = null) {
    const res = new Item(data, formatter, key)
    return (new ResourceFactory(res)).serializeResourceData(false)
  }

  toJSON(data) {
    return data
  }
}

module.exports = Transformer
