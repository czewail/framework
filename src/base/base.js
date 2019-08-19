/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Container = require('../container');
const Response = require('../response');
const RedirectResponse = require('../response/redirect');

class Base {
  /**
   * Application instance getter
   */
  get app() {
    return Container.get('app');
  }

  /**
   * Config instance getter
   */
  get config() {
    return Container.get('config');
  }

  /**
   * Message instance getter
   */
  get messenger() {
    return Container.get('messenger');
  }

  /**
   * create response instance
   * @param  {...any} params response constructor params
   */
  response(...params) {
    return new Response(...params);
  }

  /**
   * create redirect instance
   * @param  {...any} params redirect constructor params
   */
  redirect(...params) {
    return new RedirectResponse(...params);
  }
}

module.exports = Base;
