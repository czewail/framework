const Logger = require('../../logger')

class LoggerProvider {
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
    this.app.singleton('logger', Logger)
  }
}

module.exports = LoggerProvider
