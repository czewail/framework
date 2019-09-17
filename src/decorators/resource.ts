/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECT_ABLE } from '../symbol'
import { proxy } from '../base/proxy'
import { Resource as BaseResource } from '../base/resource'

function decoratorClass(target: any, name: string) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.defineMetadata('type', 'resource', target.prototype);
  Reflect.defineMetadata('name', name, target.prototype);
  return proxy(target, BaseResource);
}

function handle(args: any[], name: string) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, name);
  }
  throw new Error('@Resource must be decorate on Class');
}

export function Resource(name: string = '') {
  return function (...args: any[]) {
    return handle(args, name);
  };
};
