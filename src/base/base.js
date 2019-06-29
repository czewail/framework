/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container');
const Response = require('../response');
const RedirectResponse = require('../response/redirect');

class Base {
  constructor(request) {
    this.request = request;
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

  response(...params) {
    return new Response(...params);
  }

  redirect(...params) {
    return new RedirectResponse(...params);
  }

  get body() {
    return this.request.body;
  }

  get params() {
    return this.request.param();
  }

  get query() {
    return this.request.query;
  }

  get headers() {
    return this.request.headers;
  }
}

module.exports = Base;
