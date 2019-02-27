const Request = require('../../request')

class RequestProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create request Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider request Hook
   */
  register() {
    // bind request in container
    this.app.bind('request', (req, res, params = []) => {
      if (!req.dazeRequest) {
        req.dazeRequest = new Request(req)
      }
      return params.length > 0 ? req.dazeRequest.param(...params) : req.dazeRequest
    })
  }
}

module.exports = RequestProvider
