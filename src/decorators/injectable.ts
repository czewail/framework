/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECT_ABLE } from '../symbol'

function decorateClass(target: any) {
  Reflect.defineMetadata(INJECT_ABLE, true, target.prototype);
  return target;
}

function handle(args: any[]) {
  if (args.length === 1) {
    const [target] = args
    return decorateClass(target);
  }
  throw new Error('@Injectable must be decorate on Class');
}

export function Injectable() {
  return (...args: any[]) => handle(args);
};
