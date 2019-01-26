const Cookie = require('../../cookie')

class CookieProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Cookie Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind cookie in container
    this.app.singleton('cookie', Cookie)
  }
}

module.exports = CookieProvider
