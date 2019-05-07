const path = require('path');
const is = require('core-util-is');
const Container = require('../container');
const Pipeline = require('../pipeline');
const { isMiddleware } = require('../utils');

class Middleware {
  constructor() {
    this.app = Container.get('app');

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
  }

  /**
   * parse middle if middleware type is string type
   * @param {String} middleware
   */
  parseStringMiddleware(middleware) {
    const middlewarePath = require.resolve(path.join(this.app.middlewarePath, middleware));
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const middlewareRequired = require(middlewarePath);
    this.parseFunctionMiddleware(middlewareRequired);
  }

  /**
   * parse middle if middleware type is function type
   * @param {Function} middleware
   */
  parseFunctionMiddleware(middleware) {
    // 使用了 @Middleware 装饰器
    if (isMiddleware(middleware.prototype)) {
      this.parseClassMiddleware(middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }

  /**
   * parse middle if middleware type is class type
   * @param {Class} middleware
   */
  parseClassMiddleware(middleware) {
    if (!this.app.has(middleware)) {
      this.app.bind(middleware, middleware);
    }
    this.middlewares.push((request, next) => {
      const injectedMiddleware = this.app.get(middleware, [request, next]);
      injectedMiddleware.resolve(request, next);
    });
  }

  /**
   * handle request event
   * @param {Request} request request instance
   * @param {Function} dispatch dispatch to next node
   * @returns {Pipeline}
   */
  handle(request, dispatch) {
    return (new Pipeline())
      .send(request)
      .pipe(this.middlewares)
      .process(dispatch);
  }
}

module.exports = Middleware;
