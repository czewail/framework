/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECT_ABLE } from '../symbol'
import { proxy } from '../base/proxy'
import { Validator as BaseValidator } from '../base/validator'

function decoratorClass(target: any, name: string) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  Reflect.defineMetadata('type', 'validator', target.prototype);
  Reflect.defineMetadata('name', name, target.prototype);
  return proxy(target, BaseValidator);
}

function handle(args: any[], name: string) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, name);
  }
  throw new Error('@Validator must be decorate on Class');
}

export function Validator(name: string = '') {
  return function (...args: any[]) {
    return handle(args, name);
  };
};
