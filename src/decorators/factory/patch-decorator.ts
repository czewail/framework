/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECTABLE_KINDS, INJECT_ABLE } from '../../symbol'

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
export function patchClass(type: string, params: any, target: any) {
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
export function patchProperty(type: string, params: any, target: any, name: string) {
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
export function patchMethod(type: string, params: any, target: any, name: string) {
  Reflect.defineMetadata(INJECT_ABLE, true, target);
  const injectors = Reflect.getMetadata(INJECTABLE_KINDS.METHOD, target) || {};
  const items = injectors[name] || [];
  items.push([type, params]);
  injectors[name] = items;
  Reflect.defineMetadata(INJECTABLE_KINDS.METHOD, injectors, target);
  return target;
};
