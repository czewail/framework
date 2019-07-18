/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Base = require('./base');
const { Item, Collection } = require('../resource');

class Resource extends Base {
  collection(data, formatter) {
    const resource = new Collection(data, formatter);
    return resource.withoutKey().output();
  }

  item(data, formatter) {
    const resource = new Item(data, formatter);
    return resource.withoutKey().output();
  }

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

  resolve(data) {
    return data;
  }
}

module.exports = Resource;
