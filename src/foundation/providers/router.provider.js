const Router = require('../../router');

class RouterProvider {
  /**
   * create Router Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('router', Router);
  }

  launch() {
    const router = this.app.get('router');
    const context = this.app.get('context');
    context.pipe(router.getRouterMiddlewarePiper());
  }
}

module.exports = RouterProvider;
