/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { IBaseConstructor, IBase } from './base'

export const proxy = <B extends IBaseConstructor>(current: any, Base: B): B => new Proxy(current, {
  construct(target, argArray, newTarget) {
    const instance = Reflect.construct(target, argArray, newTarget);
    const base: IBase = new Base(...argArray);
    return new Proxy(instance, {
      get(t, p: string, receiver) {
        if (Reflect.has(t, p)) {
          return Reflect.get(t, p, receiver);
        }
        return base[p];
      },
    });
  },
});