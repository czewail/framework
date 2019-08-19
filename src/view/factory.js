/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container');

class Factory {
  app = Container.get('app');

  constructor(view) {
    this.view = view;
  }

  combineVars(request) {
    const defaultVars = {
      session(key) {
        return request.session().get(key);
      },
    };
    return Object.assign({}, defaultVars, this.view.getVars());
  }

  output(request) {
    const template = this.app.get('templateEngine');
    const vars = this.combineVars(request);
    return template.render(this.view.getTemplate(), vars);
  }
}

module.exports = Factory;
