const http = require('http');
const Container = require('../../container');
const ResponseFactory = require('../../response/manager');
const ErrorHandler = require('../../errors/handle');

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
        .then(result => new ResponseFactory(result).output(request))
        .catch((error) => {
          this.app.emit('error', error);
          const err = new ErrorHandler(request, error);
          const result = err.render();
          return new ResponseFactory(result).output(request);
        });
    });
    return server.listen(...args);
  }
}

module.exports = HttpServer;
