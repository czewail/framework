/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');
const { Item, Collection } = require('../resource');

class Resource extends Base {
  /**
   * use collection resource
   * @param {object} data resource data
   * @param {function | object} formatter resource formatter
   */
  collection(data, formatter) {
    const resource = new Collection(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * use item resource
   * @param {object} data resource data
   * @param {function | object} formatter resource formatter
   */
  item(data, formatter) {
    const resource = new Item(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * return item resource and collection resource method
   * @param {function | object} formatter resource formatter
   */
  resource(formatter) {
    return {
      item(data) {
        const resource = new Item(data, formatter);
        return resource.withoutKey().output();
      },
      collection(data) {
        const resource = Collection(data, formatter);
        return resource.withoutKey().output();
      },
    };
  }

  /**
   * default resolve method
   * @param {object} data
   */
  resolve(data) {
    return data;
  }
}

module.exports = Resource;
