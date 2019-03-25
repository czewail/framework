const Logger = require('../../logger');

class LoggerProvider {
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
    this.app.singleton('logger', Logger);
  }
}

module.exports = LoggerProvider;
