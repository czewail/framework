/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Metadata = require('../../foundation/support/metadata');
const { INJECTABLE_KINDS, INJECT_ABLE } = require('../../symbol');

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function patchClass(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
      const injectors = Metadata.get(INJECTABLE_KINDS.CONSTRUCTOR, target.prototype) || [];
      Metadata.set(INJECTABLE_KINDS.CONSTRUCTOR, [
        ...injectors,
        [type, params],
      ], target.prototype);
      return target;
    },
  };
};

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function patchProperty(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
      const injectors = Metadata.get(INJECTABLE_KINDS.PROPERTY, target.prototype) || {};
      injectors[elementDescriptor.key] = [type, params];
      Metadata.set(INJECTABLE_KINDS.PROPERTY, injectors, target.prototype);
      return target;
    },
  };
};

/**
 * METHOD_INJECTORS
 * { [name]: [
 *    [ type,  params ]
 * ] }
 */
exports.patchMethod = function patchMethod(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      Reflect.setMetadata(INJECT_ABLE, true, target.prototype);
      const injectors = Metadata.get(INJECTABLE_KINDS.METHOD, target.prototype) || {};
      const items = injectors[elementDescriptor.key] || [];
      items.push([type, params]);
      injectors[elementDescriptor.key] = items;
      Metadata.set(INJECTABLE_KINDS.METHOD, injectors, target.prototype);
      return target;
    },
  };
};
