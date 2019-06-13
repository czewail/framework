/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Metadata = require('../../foundation/support/metadata');

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function patchClass(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const injectors = Metadata.get('constructorInjectors', target.prototype) || [];
      Metadata.set('constructorInjectors', [
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
      Metadata.set('needInject', true, target.prototype);
      const injectors = Metadata.get('propertyInjectors', target.prototype) || {};
      injectors[elementDescriptor.key] = [type, params];
      Metadata.set('propertyInjectors', injectors, target.prototype);
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
      Metadata.set('needInject', true, target.prototype);
      const injectors = Metadata.get('methodInjectors', target.prototype) || {};
      const items = injectors[elementDescriptor.key] || [];
      items.push([type, params]);
      injectors[elementDescriptor.key] = items;
      Metadata.set('methodInjectors', injectors, target.prototype);
      return target;
    },
  };
};
