/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Container = require('../container');

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
}

module.exports = Base;
