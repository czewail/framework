const Response = require('../../response')
const ResponseManager = require('../../response/manager')
const Redirect = require('../../response/redirect')

class ResponseProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create response Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    this.app.singleton('responseManager', ResponseManager)
    // this.app.singleton('response', Response)
    // this.app.singleton('redirect', Redirect)
  }
}

module.exports = ResponseProvider
