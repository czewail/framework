const Config = require('../../config');

class ConfigProvider {
  /**
   * create Config Provider
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
    // bind config in container
    this.app.singleton('config', Config);
  }
}

module.exports = ConfigProvider;
