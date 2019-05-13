/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container');
const Response = require('../response');

class Base {
  constructor(request) {
    this.request = request;
    this._response = null;
  }

  get app() {
    return Container.get('app');
  }

  get config() {
    return Container.get('config');
  }

  get messenger() {
    return Container.get('messenger');
  }

  get response() {
    if (!this._response) {
      this._response = new Response();
    }
    return this._response;
  }

  get redirect() {
    return Container.get('redirect');
  }

  get cookies() {
    return this.cookie;
  }

  get cookie() {
    return Container.get('cookie');
  }

  get session() {
    return Container.get('session', [this.request]);
  }

  get body() {
    return this.request.body;
  }

  get params() {
    return this.ctx.params;
  }

  get query() {
    return this.request.query;
  }

  get headers() {
    return this.request.headers;
  }
}

module.exports = Base;
