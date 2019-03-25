const Module = require('../../module');

class ModuleProvider {
  /**
   * Create Module Provider
   * @param {APplication} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
    /**
     * @var {string} root app root module filename
     */
    this.modules = [];
  }

  /**
   * Provider register Hook
   */
  register() {
    this.app.bind('module', Module);
  }

  /**
   * Provider launch Hook
   */
  launch() {
    this.app.make('module');
  }
}

module.exports = ModuleProvider;
