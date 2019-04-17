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
    // bind request callback
    this.app.singleton('request', (req, res) => {
      if (!req.request) {
        req.request = new Request(req, res);
      }
      return req.request;
    }, true);
  }
}

module.exports = RequestProvider;
