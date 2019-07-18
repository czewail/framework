/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container');

class Base {
  get app() {
    return Container.get('app');
  }

  get config() {
    return Container.get('config');
  }

  get messenger() {
    return Container.get('messenger');
  }
}

module.exports = Base;
