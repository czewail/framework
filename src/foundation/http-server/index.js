/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const http = require('http');
const Container = require('../../container');
const Request = require('../../request');
const ErrorHandler = require('../../errors/handle');
const ResponseFactory = require('../../response/manager');

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
        .handle(request, routerHandler).catch((error) => {
          this.app.emit('error', error);
          const err = new ErrorHandler(request, error);
          return new ResponseFactory(err.render()).output(request);
        });
    });
    return server.listen(...args);
  }
}

module.exports = HttpServer;
