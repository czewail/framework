const Router = require('../../router');
const Middleware = require('../../middleware');

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
    this.app.singleton('routerMiddleware', Middleware);
  }

  launch() {
    this.app.make('router');
  }
}

module.exports = RouterProvider;
