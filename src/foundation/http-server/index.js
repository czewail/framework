const http = require('http');
const Container = require('../../container');

class HttpServer {
  constructor() {
    this.app = Container.get('app');
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      const request = this.app.get('request', [req, res]);
      return this.app.get('middleware').handle(request, this.app.get('router').getRouterPipe());
    });
    return server.listen(...args);
  }
}

module.exports = HttpServer;
