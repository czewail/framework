/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const http = require('http');
const Container = require('../../container');
const Request = require('../../request');

class HttpServer {
  constructor() {
    this.app = Container.get('app');
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const request = new Request(req, res);
      await request.initialize();
      const routerHandler = this.app.get('router').resolve();
      return this.app.get('middleware')
        .handle(request, routerHandler);
    });
    return server.listen(...args);
  }
}

module.exports = HttpServer;
