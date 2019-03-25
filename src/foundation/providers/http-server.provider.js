const httpServer = require('../http-server');

class HttpServerProvider {
  /**
   * create Logger Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind Logger in container
    this.app.singleton('httpServer', httpServer);
  }
}

module.exports = HttpServerProvider;
