// @ts-check
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
   * @type {import('../foundation/application')}
   */
  get app() {
    return Container.get('app');
  }

  /**
   * Config instance getter
   * @type {import('../config')}
   */
  get config() {
    return Container.get('config');
  }

  /**
   * Message instance getter
   * @type {import('../cluster/messenger')}
   */
  get messenger() {
    return Container.get('messenger');
  }

  /**
   * create response instance
   * @param  {any} [data]
   * @param  {number} [code]
   * @param  {object} [headers]
   * @return {import('../response')}
   */
  response(data, code, headers) {
    return new Response(data, code, headers);
  }

  /**
   * create redirect instance
   * @param  {string} [url]
   * @param  {number} [code]
   * @param  {object} [headers]
   * @return {import('../response/redirect')}
   */
  redirect(url, code, headers) {
    return new RedirectResponse(url, code, headers);
  }
}

module.exports = Base;
