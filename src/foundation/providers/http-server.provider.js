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
    this.app.singleton('httpServer', httpServer)
  }

  launch(req, res) {
    // console.log(req.method)
  }
}

module.exports = HttpServerProvider
