/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECT_ABLE } from '../symbol'
import { proxy } from '../base/proxy'
import { Base } from '../base/base'

function decoratorClass(target: any, name: string) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  if (!Reflect.hasMetadata('type', target.prototype)) {
    Reflect.defineMetadata('type', 'component', target.prototype);
  }
  Reflect.defineMetadata('name', name, target.prototype);
  return proxy(target, Base);
}

function handle(args: any[], name: string) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, name);
  }
  throw new Error('@Component must be decorate on Class');
}

export function Component(name: string = '') {
  return function (...args: any[]) {
    return handle(args, name);
  };
};
