const Request = require('../../request');

class RequestProvider {
  /**
   * create request Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  /**
   * Provider request Hook
   */
  register() {
    this.app.multiton('request', Request);
  }
}

module.exports = RequestProvider;
