const path = require('path');
const Pipeline = require('../../pipeline');

class MiddlewareProvider {
  /**
   * create Middleware Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  register() {
    this.app.bind('context', Pipeline);
  }

  launch() {
    const config = this.app.get('config');
    const middlewares = config.get('middleware', []);
    const context = this.app.get('context');
    for (const mid of middlewares) {
      // 用户中间件目录存在中间件
      const userMiddlewarePath = path.join(this.app.middlewarePath, mid);
      // 确认模块可加载
      if (require.resolve(userMiddlewarePath)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const CurrentMiddleware = require(userMiddlewarePath);
        context.pipe((ctx) => {
          const middle = new CurrentMiddleware();
          return middle.handle(ctx);
        });
      }
    }
  }
}

module.exports = MiddlewareProvider;
