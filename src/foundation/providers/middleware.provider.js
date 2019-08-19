/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Middleware = require('../../middleware');

class MiddlewareProvider {
  /**
   * create Middleware Provider
   * @param {Object} app Application
   */
  constructor(app) {
    /**
     * @var {Object} app Application
     */
    this.app = app;
  }

  register() {
    this.app.bind('middleware', Middleware);
  }

  launch() {
    const middleware = this.app.get('middleware');

    middleware.register((request, next) => {
      const { res } = request;
      if (!res.headersSent) {
        res.setHeader('X-Power-By', 'Daze.js');
      }
      return next();
    });
  }
}

module.exports = MiddlewareProvider;
