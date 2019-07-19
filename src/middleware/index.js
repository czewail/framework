/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const is = require('core-util-is');
const Pipeline = require('../pipeline');

class Middleware {
  /**
   * Create Middleware Instance
   * @param {object} app Application instance
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;

    /**
     * @var {Array} middlewares middlewares stack
     */
    this.middlewares = [];
  }

  /**
   * register a middleware
   * @param {String | Function | Class} middleware
   */
  register(middleware) {
    if (is.isString(middleware)) {
      this.parseStringMiddleware(middleware);
    } else if (is.isFunction(middleware)) {
      this.parseFunctionMiddleware(middleware);
    }
    return this;
  }

  /**
   * combine another Middleware before this middlewares
   * @param {Middleware} anotherMiddleware
   */
  combineBefore(anotherMiddleware) {
    if (!(anotherMiddleware instanceof Middleware)) return this;
    this.middlewares.unshift(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * combine another Middleware after this middlewares
   * @param {Middleware} anotherMiddleware
   */
  combineAfter(anotherMiddleware) {
    if (!(anotherMiddleware instanceof Middleware)) return this;
    this.middlewares.push(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * parse middle if middleware type is string type
   * @param {String} middleware
   */
  parseStringMiddleware(middleware) {
    const _middleware = this.app.get(`middleware.${middleware}`);
    if (!_middleware) return this;
    this.parseClassInstanceMiddleware(_middleware);
    return this;
  }

  /**
   * parse middle if middleware type is function type
   * @param {Function} middleware
   */
  parseFunctionMiddleware(middleware) {
    // 使用了 @Middleware 装饰器
    if (Reflect.getMetadata('type', middleware.prototype) === 'middleware') {
      const _middleware = Reflect.construct(middleware);
      this.parseClassInstanceMiddleware(_middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }

  /**
   * parse middle if middleware type is class type
   * @param {Class} middleware
   */
  parseClassInstanceMiddleware(middleware) {
    this.middlewares.push(async (request, next) => middleware.resolve(request, next));
  }

  /**
   * handle request event
   * @param {Request} request request instance
   * @param {Function} dispatch dispatch to next node
   * @returns {Pipeline}
   */
  async handle(request, dispatch) {
    return (new Pipeline())
      .send(request)
      .pipe(...this.middlewares)
      .process(dispatch);
  }
}

module.exports = Middleware;
