// const path = require('path');
// const Pipeline = require('../../pipeline');
const Middleware = require('../../middleware');

class MiddlewareProvider {
  /**
   * create Middleware Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  register() {
    this.app.bind('middleware', Middleware);
  }

  launch() {
    this.app.make('middleware');
    // const middlewareInstance = this.app.get('middleware');
    // const middlewares = this.app.get('config').get('middleware', []);
    // for (const middleware of middlewares) {
    //   middlewareInstance.register(middleware);
    // }
  }
}

module.exports = MiddlewareProvider;
