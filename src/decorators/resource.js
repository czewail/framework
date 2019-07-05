/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { Item, Collection } = require('../resource');
// const ResourceFactory = require('../resource/DEPRECATED_factory');

function injectClass(elementDescriptor, name) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata('type', 'resource', target.prototype);
      Reflect.setMetadata('resource', name, target.prototype);
      target.prototype.collection = function (data, formatter) {
        const resource = new Collection(data, formatter);
        return resource.withoutKey().output();
      };
      target.prototype.item = function (data, formatter) {
        const resource = new Item(data, formatter);
        return resource.withoutKey().output();
      };
      target.prototype.resource = function (formatter) {
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
