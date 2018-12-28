/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Resource = require('./resource')
const Collection = require('./collection')
const Item = require('./item')
const Transformer = require('./transformer')

Resource.Collection = Collection
Resource.Item = Item
Resource.Transformer = Transformer

module.exports = Resource
