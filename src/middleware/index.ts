/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import is from 'core-util-is'
import { Container} from '../container'
import { Pipeline } from '../pipeline'

export class Middleware {
  app: any;
  middlewares: any[];
  constructor() {
    this.app = Container.get('app');

    /**
     * @type {Array} middlewares middlewares stack
     */
    this.middlewares = [];
  }

  /**
   * register a middleware
   */
  register(middleware: any, args: any[]) {
    if (is.isString(middleware)) {
      this.parseStringMiddleware(middleware, args);
    } else if (is.isFunction(middleware)) {
      this.parseFunctionMiddleware(middleware, args);
    }
    return this;
  }

  /**
   * combine another Middleware before this middlewares
   */
  combineBefore(anotherMiddleware: any) {
    if (!(anotherMiddleware instanceof Middleware)) return this;
    this.middlewares.unshift(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * combine another Middleware after this middlewares
   */
  combineAfter(anotherMiddleware: any) {
    if (!(anotherMiddleware instanceof Middleware)) return this;
    this.middlewares.push(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * parse middle if middleware type is string type
   */
  parseStringMiddleware(middleware: string, args: any[] = []) {
    const _middleware = this.app.get(`middleware.${middleware}`, args);
    if (!_middleware) return this;
    this.parseClassInstanceMiddleware(_middleware);
    return this;
  }

  /**
   * parse middle if middleware type is function type
   */
  parseFunctionMiddleware(middleware: any, args: any[] = []) {
    // 使用了 @Middleware 装饰器
    if (Reflect.getMetadata('type', middleware.prototype) === 'middleware') {
      const MiddlewareClass = middleware;
      const _middleware = new MiddlewareClass(...args);
      this.parseClassInstanceMiddleware(_middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }

  /**
   * parse middle if middleware type is class type
   */
  parseClassInstanceMiddleware(middleware: any) {
    this.middlewares.push(async (request: any, next: any) => middleware.resolve(request, next));
  }

  /**
   * handle request event
   */
  async handle(request: any, dispatch: any) {
    return (new Pipeline())
      .send(request)
      .pipe(...this.middlewares)
      .process(dispatch);
  }
}
