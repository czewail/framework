/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
export const proxy = (current: any, Base: any) => new Proxy(current, {
  construct(target, argArray, newTarget) {
    const instance = Reflect.construct(target, argArray, newTarget);
    const base = new Base(...argArray);
    return new Proxy(instance, {
      get(t, p, receiver) {
        if (Reflect.has(t, p)) {
          return Reflect.get(t, p, receiver);
        }
        return base[p];
      },
    });
  },
});