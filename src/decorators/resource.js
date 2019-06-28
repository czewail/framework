/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { Item, Collection } = require('../resource');
const ResourceFactory = require('../resource/factory');

function injectClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'resource', target.prototype);
      Reflect.setMetadata('resource', name, target.prototype);
      target.prototype.collection = function (data, formatter, key = null) {
        const res = new Collection(data, formatter, key);
        return (new ResourceFactory(res)).serializeResourceData(false);
      };
      target.prototype.item = function (data, formatter, key = null) {
        const res = new Item(data, formatter, key);
        return (new ResourceFactory(res)).serializeResourceData(false);
      };
      target.resolve = function (data) {
        return data;
      };
      return target;
    },
  };
}

function handle(elementDescriptor, name) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor, name);
  }
  return elementDescriptor;
}

module.exports = function Resource(name) {
  return elementDescriptor => handle(elementDescriptor, name);
};
