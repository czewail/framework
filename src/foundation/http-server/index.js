const http = require('http');
// const is = require('core-util-is');
const Container = require('../../container');
const Request = require('../../request');
// const ResponseFactory = require('../../response/manager');
// const ErrorHandler = require('../../errors/handle');
// const HttpError = require('../../errors/http-error');
// const symbols = require('../../symbol');

class HttpServer {
  constructor() {
    this.app = Container.get('app');
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const request = new Request(req, res);
      const processer = this.app.get('router').resolve();
      return this.app.get('middleware')
        .handle(request, processer);
      // .then(this.handleResponse(request))
    });
    return server.listen(...args);
  }

  // flashSession(request) {
  //   const flashed = request.session().get(symbols.SESSION.FLASHED);
  //   const flashs = request.session().get(symbols.SESSION.FLASHS);
  //   if (flashed === true && is.isArray(flashs)) {
  //     for (const flash of flashs) {
  //       request.session().remove(flash);
  //     }
  //     request.session().set(symbols.SESSION.FLASHS, []);
  //   }
  //   if (flashed === false) {
  //     request.session().set(symbols.SESSION.FLASHED, true);
  //   }
  //   request.session().set(symbols.SESSION.PREVIOUS, request.session().get(symbols.SESSION.CURRENT) || '');
  //   request.session().set(symbols.SESSION.CURRENT, request.url);
  // }

  // /**
  //  * handle response
  //  * @param {Request} request Request Instance
  //  */
  // handleResponse(request) {
  //   return async (response) => {
  //     const code = response.getCode();
  //     const data = response.getData();
  //     const headers = response.getHeaders();

  //     if (!response._isStaticServer) {
  //       this.flashSession(request);
  //     }
  //     if (code >= 400) {
  //       throw new HttpError(code, data, headers);
  //     }
  //     return response;
  //   };
  // }

  // async output(request, response) {
  //   if (!response._isStaticServer) {
  //     await response.commitCookies(request);
  //   }
  //   return new ResponseFactory(response).output(request);
  // }
}

module.exports = HttpServer;
