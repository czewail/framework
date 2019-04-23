const Response = require('../../response');
const ResponseManager = require('../../response/manager');
// const Redirect = require('../../response/redirect');

class ResponseProvider {
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
    this.app.singleton('responseManager', ResponseManager);
    this.app.multiton('response', Response);
  }
}

module.exports = ResponseProvider;
