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
}

module.exports = RouterProvider
