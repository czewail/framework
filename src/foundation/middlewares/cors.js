
// const cors = require('koa2-cors');
const vary = require('vary');
// const Middleware = require('../../base/middleware');
const Response = require('../../response');
const Middleware = require('../../decorators/middleware');

@Middleware()
class CORSMiddleware {
  get origin() {
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

  async resolve(request, next) {
    const requestOrigin = request.getHeader('Origin');
    if (!requestOrigin) return next();
    if (request.isOptions()) {
      // Preflight Request
      if (!request.getHeader('Access-Control-Request-Method')) return next();

      const response = new Response();

      response.setHeader('Access-Control-Allow-Origin', this.origin);

      if (this.credentials) {
        response.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      if (this.maxAge) {
        response.setHeader('Access-Control-Max-Age', this.maxAge);
      }

      if (this.allowMethods) {
        response.setHeader('Access-Control-Allow-Methods', this.allowMethods);
      }

      response.setHeader('Access-Control-Request-Headers', this.allowHeaders || request.getHeader('Access-Control-Request-Headers'));

      return response.NoContent();
    }

    let response = await next();

    // todo response==undefined

    if (!(response instanceof Response)) {
      response = (new Response()).setData(response);
    }

    response.setHeader('Access-Control-Allow-Origin', this.origin);

    if (this.credentials) {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  }
}

module.exports = CORSMiddleware;
