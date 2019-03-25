const is = require('is-type-of');
const Session = require('../../session');
const symbols = require('../../symbol');

class SessionProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * create Config Provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind session in container
    this.app.singleton('session', (ctx) => new Session(ctx));
  }

  /**
   * Provider launch Hook
   */
  launch() {
    this.flushSession();
  }

  /**
  * clear flash session
  */
  flushSession() {
    this.app.use(async (ctx, next) => {
      if (ctx.session[symbols.SESSION_FLASHED] === true && is.array(ctx.session[symbols.SESSION_FLASHS])) {
        for (const flash of ctx.session[symbols.SESSION_FLASHS]) {
          delete ctx.session[flash];
        }
        ctx.session[symbols.SESSION_FLASHS] = [];
      }
      if (ctx.session[symbols.SESSION_FLASHED] === false) {
        ctx.session[symbols.SESSION_FLASHED] = true;
      }
      await next();
    });
  }
}

module.exports = SessionProvider;
