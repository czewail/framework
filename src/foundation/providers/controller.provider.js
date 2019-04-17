const Controller = require('../../controller');

class ControllerProvider {
  /**
   * create Router Provider
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
    this.app.singleton('controller', Controller);
  }

  launch() {
    this.app.make('controller');
  }
}

module.exports = ControllerProvider;
