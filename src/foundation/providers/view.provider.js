/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const View = require('../../view');

class ViewProvider {
  /**
   * @var {Object} app Application
   */
  app = null;

  /**
   * create View Provider
   * @param {Object} app Application
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind View in container
    this.app.singleton('view', View);
  }
}

module.exports = ViewProvider;
