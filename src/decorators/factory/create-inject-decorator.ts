/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { patchClass, patchProperty, patchMethod } from './patch-decorator'

function decorateClass(target: any, params: any, type: string) {
  return patchClass(type, params, target);
}

function decorateMethodAndProperty(target: any, name: string, descriptor: any, params: any, type: string) {
  if (Reflect.has(descriptor, 'value') && typeof descriptor.value === 'function') {
    patchMethod(type, params, target, name);
  }

  if (Reflect.has(descriptor, 'initializer') || Reflect.has(descriptor, 'get')) {
    patchProperty(type, params, target, name);
  }
  return descriptor;
}

function handle(args: any[], params: any, type: string) {
  if (args.length === 1) {
    const [target] = args
    return decorateClass(target, params, type);
  }
  const [target, name, descriptor] = args
  return decorateMethodAndProperty(target, name, descriptor, params, type);
}

export function createInjectDecorator(type: string) {
  return (...args: any[]) => (...argsClass: any[]) => handle(argsClass, args, type);
};
