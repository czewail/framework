/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Logger = require('../../logger');

class LoggerProvider {
  /**
   * create Logger Provider
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
    // bind Logger in container
    this.app.singleton('logger', Logger);
  }
}

module.exports = LoggerProvider;
