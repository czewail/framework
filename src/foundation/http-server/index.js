const http = require('http');
const Container = require('../../container');
const ResponseFactory = require('../../response/manager');
const ErrorHandler = require('../../errors/handle');
const HttpError = require('../../errors/http-error');

class HttpServer {
  constructor() {
    this.app = Container.get('app');
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const request = this.app.get('request', [req, res]);
      const processer = this.app.get('router').resolve();
      return this.app.get('middleware')
        .handle(request, processer)
        .then(async (response) => {
          const code = response.getCode();
          const data = response.getData();
          const headers = response.getHeaders();
          await response.commitCookies(request);
          if (code >= 400) {
            throw new HttpError(code, data, headers);
          }
          return response;
        })
        .then(response => this.output(request, response))
        .catch((error) => {
          this.app.emit('error', error);
          const err = new ErrorHandler(request, error);
          return this.output(request, err.render());
        });
    });
    return server.listen(...args);
  }

  output(request, response) {
    return new ResponseFactory(response).output(request);
  }
}

module.exports = HttpServer;
