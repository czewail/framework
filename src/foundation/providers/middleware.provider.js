// const path = require('path');
// const Pipeline = require('../../pipeline');
const Middleware = require('../../middleware');
// const { Cors } = require('../middlewares');

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
    const middleware = this.app.make('middleware');
    middleware.powerBy();
    // middleware.register(Cors);
    // const middlewareInstance = this.app.get('middleware');
    // const middlewares = this.app.get('config').get('middleware', []);
    // for (const middleware of middlewares) {
    //   middlewareInstance.register(middleware);
    // }
  }
}

module.exports = MiddlewareProvider;
