/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Middleware = require('../../middleware');
const VerifyCsrfToken = require('../middlewares/verify-csrf-token');

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
    this.app.singleton('middleware', Middleware);
  }

  launch() {
    this.app.get('loader').loadMiddleware(VerifyCsrfToken);
  }
}

module.exports = MiddlewareProvider;
