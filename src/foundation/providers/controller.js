/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Controller = require('../../controller');

class ControllerProvider {
  /**
   * create Controller Provider
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
    // bind controller in container
    this.app.singleton('controller', Controller);
  }
}

module.exports = ControllerProvider;
