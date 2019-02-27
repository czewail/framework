const http = require('http')
const httpServer = require('../http-server')

class HttpServerProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Logger Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind Logger in container
    this.app.singleton('http.Server', http.Server)
  }
}

module.exports = HttpServerProvider
