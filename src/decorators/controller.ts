/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers'
import { INJECT_ABLE } from '../symbol'
import { Container } from '../container'
import { Response } from '../response'
import { Redirect } from '../response/redirect'

type Constructor<T = {}> = new (...args: any[]) => T;

export function Controller(prefix: string = '') {
  return function <T extends Constructor>(constructor: T) {
    Reflect.defineMetadata(INJECT_ABLE, true, constructor.prototype);
    Reflect.defineMetadata('isRoute', true, constructor.prototype);
    Reflect.defineMetadata('type', 'controller', constructor.prototype);
    Reflect.defineMetadata('prefix', formatPrefix(prefix), constructor.prototype);
    return class extends constructor {
      /**
     * Application instance getter
     */
      app = Container.get('app');
      // /**
      //  * Config instance getter
      //  */
      // get config() {
      //   return Container.get('config');
      // }

      // /**
      //  * Message instance getter
      //  */
      // get messenger() {
      //   return Container.get('messenger');
      // }

      // /**
      //  * create response instance
      //  * @param params response constructor params
      //  */
      // response(...params: any[]) {
      //   return new Response(...params);
      // }

      // /**
      //  * create redirect instance
      //  * @param params redirect constructor params
      //  */
      // redirect(...params: any[]) {
      //   return new Redirect(...params);
      // }
    }
  };
};
