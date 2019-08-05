
const LoadSessionMiddleware = require('../../session/middleware/load-session');

class SessionProvider {
  /**
   * create response Provider
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
    this.app.multiton('session', request => request.session(), true);
  }

  /**
   * Provider launch Hook
   */
  launch() {
    this.app.get('middleware').register(LoadSessionMiddleware);
  }
}

module.exports = SessionProvider;
