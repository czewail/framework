const http = require('http');
const Container = require('../../container');
const ResponseFactory = require('../../response/manager');

class HttpServer {
  constructor() {
    this.app = Container.get('app');
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      const request = this.app.get('request', [req, res]);
      return this.app.get('middleware').handle(request, this.app.get('router').resolve());
      // return result.then(finalReault => (new ResponseFactory(finalReault).output(request)));
    });
    return server.listen(...args);
  }
}

module.exports = HttpServer;
