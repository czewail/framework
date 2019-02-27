const Module = require('../../module')

class ModuleProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * @var {string} root app root module filename
   */

  modules = [];

  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    this.app.bind('module', Module)
  }

  launch() {
    this.app.make('module')
  }
}

module.exports = ModuleProvider
