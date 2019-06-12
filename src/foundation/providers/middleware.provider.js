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

    // middleware.register(async (request, next) => {
    //   const response = await next();
    //   await request.session().commit(response);
    //   return response;
    // });

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
