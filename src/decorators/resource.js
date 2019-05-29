/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { Item, Collection } = require('../resource');
const ResourceFactory = require('../resource/factory');

function injectClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      return class extends target {
        collection(data, formatter, key = null) {
          const res = new Collection(data, formatter, key);
          return (new ResourceFactory(res)).serializeResourceData(false);
        }

        item(data, formatter, key = null) {
          const res = new Item(data, formatter, key);
          return (new ResourceFactory(res)).serializeResourceData(false);
        }

        resolve(data) {
          return data;
        }
      };
    },
  };
}

function handle(elementDescriptor) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Resource() {
  return elementDescriptor => handle(elementDescriptor);
};
