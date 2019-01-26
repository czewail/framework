const Config = require('../../config')

class ConfigProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Config Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('config', Config)
  }
}

module.exports = ConfigProvider
