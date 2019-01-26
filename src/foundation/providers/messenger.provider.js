const Messenger = require('../../cluster/messenger')

class MessengerProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Messenger Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind Messenger in container
    this.app.singleton('messenger', Messenger)
  }
}

module.exports = MessengerProvider
