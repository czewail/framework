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
    const middleware = this.app.get('middleware');

    middleware.register((request, next) => {
      const { res } = request;
      if (!res.headersSent) {
        res.setHeader('X-Power-By', 'Daze.js');
      }
      return next();
    });
  }
}

module.exports = MiddlewareProvider;
