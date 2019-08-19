/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

class SessionProvider {
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
    this.app.multiton('session', request => request.session(), true);
  }

  /**
   * Provider launch Hook
   */
  launch() {
    // this.app.get('middleware').register(LoadSessionMiddleware);
  }
}

module.exports = SessionProvider;
