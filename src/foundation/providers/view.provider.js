const View = require('../../view')

class ViewProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create View Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind View in container
    this.app.singleton('view', View)
  }
}

module.exports = ViewProvider
