const path = require('path')
const isClass = require('node-is-class')
const injectorFactory = require('../injector/factory')

class MiddlewareProvider {
  /**
  * @var {object} app Application
  */
  app = null;

  /**
   * create Middleware Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider launch Hook
   */
  launch() {
    const config = this.app.get('config')
    const middlewares = config.get('middleware', [])
    for (const mid of middlewares) {
      // 用户中间件目录存在中间件
      const userMiddlewarePath = path.join(this.app.middlewarePath, mid)
      // 确认模块可加载
      if (require.resolve(userMiddlewarePath)) {
        const currentMiddleware = require(userMiddlewarePath)
        if (isClass(currentMiddleware)) {
          this.app.use((ctx, next) => {
            try {
              const injectedMiddleware = injectorFactory(currentMiddleware, ctx)
              return injectedMiddleware.handle(ctx, next)
            } catch (err) {
              this.app.koa.emit('error', err, ctx)
            }
          })
        } else {
          this.app.use(currentMiddleware)
        }
      }
    }
  }
}

module.exports = MiddlewareProvider
