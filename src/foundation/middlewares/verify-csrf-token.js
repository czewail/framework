const minimatch = require('minimatch');
const Middleware = require('../../base/middleware');
const Message = require('../support/message');
const HttpError = require('../../errors/http-error');

const defaultExcludedMethods = ['HEAD', 'GET', 'OPTIONS'];
const defaultInvalidTokenMessage = 'Invalid CSRF token';

class VerifyCsrfToken extends Middleware {
  constructor(context) {
    super(context);
    this.message = new Message();
  }

  /**
   * The URIs that should be excluded from CSRF verification.
   * @type {array}
   */
  get except() {
    return [];
  }

  get excludedMethods() {
    return defaultExcludedMethods;
  }

  get invalidTokenMessage() {
    return defaultInvalidTokenMessage;
  }

  handle(ctx) {
    if (
      this.isReadVerb(ctx)
      || this.inExcept(ctx)
      || this.tokenValidity(ctx)
    ) {
      return ctx
    } 
      this.message.add('token', this.invalidTokenMessage)
      // console.log(this.message.toJSON())
      throw new HttpError(403, this.invalidTokenMessage)
      // ctx.throw(403, this.invalidTokenMessage)
    
  }

  /**
   * Verify the token validity
   * @refer https://github.com/koajs/csrf/blob/master/src/index.js
   * @param {object} ctx
   * @returns {boolean}
   */
  tokenValidity(ctx) {
    const bodyToken = (ctx.request.body && typeof ctx.request.body._token === 'string')
      ? ctx.request.body._token : false;
    const token = bodyToken
      || ctx.get('csrf-token')
      || ctx.get('xsrf-token')
      || ctx.get('x-csrf-token')
      || ctx.get('x-xsrf-token');

    if (!token) {
      return false;
    }
    if (!this.app.get('csrf').verify(ctx.session.secret, token)) {
      return false;
    }
    return true;
  }

  /**
   * Check if the current request path requires validation
   * @param {object} ctx
   * @returns {boolean}
   */
  inExcept(ctx) {
    for (const except of this.except) {
      if (minimatch(ctx.path, except)) return true;
    }
    return false;
  }

  /**
   * Check if the current request type requires validation
   * @param {object} ctx
   * @returns {boolean}
   */
  isReadVerb(ctx) {
    const excludedMethods = Array.isArray(this.excludedMethods) ? this.excludedMethods : defaultExcludedMethods;
    return !!~excludedMethods.indexOf(ctx.method.toUpperCase());
  }
}

module.exports = VerifyCsrfToken;
