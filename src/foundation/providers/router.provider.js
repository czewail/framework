/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Router = require('../../router');
const Middleware = require('../../middleware');

class RouterProvider {
  /**
   * create Router Provider
   * @param {Object} app Application
   */
  constructor(app) {
    /**
     * @var {Object} app Application
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
