/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { INJECTABLE_KINDS, INJECT_ABLE } = require('../../symbol');

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function patchClass(type, params, target) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  const injectors = Reflect.getMetadata(INJECTABLE_KINDS.CONSTRUCTOR, target.prototype) || [];
  Reflect.defineMetadata(INJECTABLE_KINDS.CONSTRUCTOR, [
    ...injectors,
    [type, params],
  ], target.prototype);
  return target;
};

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function patchProperty(type, params, target, name) {
  Reflect.defineMetadata(INJECT_ABLE, true, target);
  const injectors = Reflect.getMetadata(INJECTABLE_KINDS.PROPERTY, target) || {};
  injectors[name] = [type, params];
  Reflect.defineMetadata(INJECTABLE_KINDS.PROPERTY, injectors, target);
  return target;
};

/**
 * METHOD_INJECTORS
 * { [name]: [
 *    [ type,  params ]
 * ] }
 */
exports.patchMethod = function patchMethod(type, params, target, name) {
  Reflect.defineMetadata(INJECT_ABLE, true, target);
  const injectors = Reflect.getMetadata(INJECTABLE_KINDS.METHOD, target) || {};
  const items = injectors[name] || [];
  items.push([type, params]);
  injectors[name] = items;
  Reflect.defineMetadata(INJECTABLE_KINDS.METHOD, injectors, target);
  return target;
};
