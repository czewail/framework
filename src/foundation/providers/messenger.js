/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Messenger = require('../../cluster/messenger');

class MessengerProvider {
  /**
   * create Messenger Provider
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
    // bind Messenger in container
    this.app.singleton('messenger', Messenger);
  }
}

module.exports = MessengerProvider;
