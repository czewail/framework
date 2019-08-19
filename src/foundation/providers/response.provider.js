/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Response = require('../../response');
const ResponseManager = require('../../response/manager');

class ResponseProvider {
  /**
   * create response Provider
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
    this.app.singleton('responseManager', ResponseManager);
    this.app.multiton('response', Response);
  }
}

module.exports = ResponseProvider;
