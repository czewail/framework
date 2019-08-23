/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Loader = require('../../loader');

// FIXME 不单单是这个文件，而是所有provider。建议加一个Provider基类作为类型，不然很多涉及到provider基类的地方无法做类型标记(譬如Application)

class LoaderProvider {
  constructor(app) {
    this.app = app;
  }

  register() {
    this.app.singleton('loader', Loader);
  }

  launch() {
    this.app.get('loader').resolve();
  }
}


module.exports = LoaderProvider;
