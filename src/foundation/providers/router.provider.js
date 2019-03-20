const Router = require('../../router')

class RouterProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Router Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('router', Router)
  }

  launch() {
    const router = this.app.get('router')
    const context = this.app.get('context')
    context.pipe(router.getRouterMiddlewarePiper())
    // this.app.get('httpServer').use(router.handle())
  }
}

module.exports = RouterProvider
