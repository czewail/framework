const Messenger = require('../../cluster/messenger');

class MessengerProvider {
  /**
   * create Messenger Provider
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
    // bind Messenger in container
    this.app.singleton('messenger', Messenger);
  }
}

module.exports = MessengerProvider;
