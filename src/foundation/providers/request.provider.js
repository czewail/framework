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
      if (!ctx.request) {
        ctx.request = new Request(ctx)
      }
      return params.length > 0 ? ctx.request.param(...params) : ctx.request
    })
  }
}

module.exports = RequestProvider
