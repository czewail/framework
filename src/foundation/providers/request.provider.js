const Request = require('../../request');
const BodyParse = require('../../request/middlewares/body-parse.middleware');

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
    // bind req callback
    this.app.singleton('req', req => req, true);
    // bind res callback
    this.app.singleton('res', (req, res) => res, true);
  }

  launch() {
    // register body-parse middleware
    this.app.get('middleware').register(BodyParse);
  }
}

module.exports = RequestProvider;
