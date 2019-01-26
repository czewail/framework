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
    this.app.bind('request', (ctx, params = []) => {
      const request = new Request(ctx)
      return params.length > 0 ? request.param(...params) : request
    })
  }
}

module.exports = RequestProvider
