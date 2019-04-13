
const cors = require('koa2-cors');
const Middleware = require('../../base/middleware');

class CorsMiddleware extends Middleware {
  origin() {
    return '*';
  }

  get maxAge() {
    return 5;
  }

  get credentials() {
    return true;
  }

  get allowMethods() {
    return ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'];
  }

  get allowHeaders() {
    return ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'];
  }

  handle(ctx, next) {
    return cors({
      origin: (c) => this.origin(c) || '*',
      maxAge: this.maxAge,
      credentials: this.credentials,
      allowMethods: this.allowMethods,
      allowHeaders: this.allowHeaders,
    })(ctx, next);
  }
}

module.exports = CorsMiddleware;
