const ApplicationMiddleware = require('./application-middleware')

class MiddlewareProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Config Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind config in container
    this.app.singleton('applicationMiddleware', ApplicationMiddleware)
  }

  launch() {
    this.parseMiddlewares()
  }


  parseMiddlewares() {
    const applicationMiddleware = this.app.get('applicationMiddleware')
    applicationMiddleware.use((req, res, next) => {
      console.log(111222)
      next()
    })
  }
}

module.exports = MiddlewareProvider
