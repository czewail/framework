const Controller = require('../../controller');

class ControllerProvider {
  /**
   * create Controller Provider
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
    // bind controller in container
    this.app.singleton('controller', Controller);
  }
}

module.exports = ControllerProvider;
