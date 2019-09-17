/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { proxy } from '../base/proxy'
import { Middleware as BaseMiddleware } from '../base/middleware'

function decoratorClass(target: any, name: string) {
  Reflect.defineMetadata('type', 'middleware', target.prototype);
  Reflect.defineMetadata('name', name, target.prototype);
  return proxy(target, BaseMiddleware);
}

function handle(args: any[], name: string) {
  if (args.length === 1) {
    const [target] = args
    return decoratorClass(target, name);
  }
  throw new TypeError('@Middleware must be decorate on Class');
}

export function Middleware(name: string) {
  return (...args: any[]) => handle(args, name);
};