/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Tokens = require('csrf');
const symbols = require('../../symbol');

// FIXME 不单单是这个文件，而是所有provider。建议加一个Provider基类作为类型，不然很多涉及到provider基类的地方无法做类型标记(譬如Application)

class AppProvider {
  constructor(app) {
    this.app = app;
  }

  register() {
    this.app.singleton('csrf', Tokens);

    this.registerInjectors();
  }

  registerInjectors() {
    // for @HttpRequest
    this.app.multiton(
      symbols.INJECTORS.REQUEST,
      request => request,
      true,
    );

    // for @HttpResponse
    this.app.multiton(
      symbols.INJECTORS.RESPONSE,
      request => request.response,
      true,
    );

    // for @Req
    this.app.multiton(
      symbols.INJECTORS.REQ,
      request => request.req,
      true,
    );

    // for @Res
    this.app.multiton(
      symbols.INJECTORS.RES,
      request => request.res,
      true,
    );

    // for @HttpQuery
    this.app.multiton(symbols.INJECTORS.QUERY, request => request.query, true);

    // for @HttpParams
    this.app.multiton(
      symbols.INJECTORS.PARAMS,
      (name, request) => (name ? request.param(name) : request.param()),
      true,
    );

    // for @HttpHeaders
    this.app.multiton(
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
    this.app.multiton(
      symbols.INJECTORS.BODY,
      request => request.body,
      true,
    );

    // for @CookieValue
    this.app.multiton(
      symbols.INJECTORS.COOKIE,
      (key, request) => (key ? request.cookie(key) : request.cookies),
      true,
    );

    // for @SessionValue
    this.app.multiton(
      symbols.INJECTORS.SESSION,
      (key, request) => (key ? request.session(key) : request.session()),
      true,
    );
  }
}


module.exports = AppProvider;
