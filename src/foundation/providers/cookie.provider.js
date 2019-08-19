/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Cookie = require('../../cookie');

class CookieProvider {
  /**
   * @var {Object} app Application
   */
  app = null;

  /**
   * create Cookie Provider
   * @param {Object} app Application
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind cookie in container
    this.app.singleton('cookie', Cookie);
  }
}

module.exports = CookieProvider;
