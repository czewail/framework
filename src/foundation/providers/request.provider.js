const Request = require('../../request');
const RequestBodyMiddleware = require('../../request/middleware/body.middleware');
const symbols = require('../../symbol');

class RequestProvider {
  /**
   * create request Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;
  }

  /**
   * Provider request Hook
   */
  register() {
    // bind request callback
    this.app.singleton('request', (req, res) => {
      if (!req.request) {
        req.request = new Request(req, res);
      }
      return req.request;
    }, true);

    // for @HttpRequest
    this.app.singleton(
      symbols.INJECTORS.REQUEST,
      request => request,
      true,
    );

    // for @Req
    this.app.singleton(
      symbols.INJECTORS.REQ,
      request => request.req,
      true,
    );

    // for @Res
    this.app.singleton(
      symbols.INJECTORS.RES,
      request => request.res,
      true,
    );

    // for @HttpQuery
    this.app.singleton(symbols.INJECTORS.QUERY, request => request.query, true);

    // for @HttpParams
    this.app.singleton(
      symbols.INJECTORS.PARAMS,
      (name, request) => (name ? request.param(name) : request.param()),
      true,
    );

    // for @HttpHeaders
    this.app.singleton(
      symbols.INJECTORS.HEADERS,
      (key, request) => {
        if (key) {
          return request.headers[key];
        }
        return request.headers;
      },
      true,
    );

    // for @HttpBody
    this.app.singleton(
      symbols.INJECTORS.BODY,
      request => request.body,
      true,
    );

    // for @CookieValue
    this.app.singleton(
      symbols.INJECTORS.COOKIE,
      (key, request) => (key ? request.cookie(key) : request.cookies),
      true,
    );

    // for @SessionValue
    this.app.singleton(
      symbols.INJECTORS.SESSION,
      (key, request) => (key ? request.session(key) : request.session()),
      true,
    );
  }

  launch() {
    this.app.get('middleware').register(RequestBodyMiddleware());
  }
}

module.exports = RequestProvider;
