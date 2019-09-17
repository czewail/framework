/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers'
import { INJECT_ABLE } from '../symbol'
import { proxy } from '../base/proxy'
import { Controller as BaseController } from '../base/controller'

function decoratorClass(target: any, prefix: string) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.defineMetadata('isRoute', true, target.prototype);
  Reflect.defineMetadata('type', 'controller', target.prototype);
  Reflect.defineMetadata('prefix', formatPrefix(prefix), target.prototype);
  return proxy(target, BaseController);
}

function handle(args: any[], prefix: string) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, prefix);
  }
  throw new Error('@Route must be decorate on Class');
}

export function Controller(prefix: string = '') {
  return function (...args: any[]) {
    return handle(args, prefix);
  };
};
