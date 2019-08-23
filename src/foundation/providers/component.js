
/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Component = require('../../component');
const symbols = require('../../symbol');

class ComponentProvider {
  /**
   * create Component Provider
   * @param {Object} app Application
   */
  constructor(app) {
    /**
     * @type {Object} app Application
     */
    this.app = app;
  }

  /**
   * Provider register Hook
   */
  register() {
    // bind component in container
    this.app.singleton('component', Component);

    // for @useService
    this.app.singleton(
      symbols.INJECTORS.SERVICE,
      name => this.app.get(`service.${name}`),
      true,
    );

    // for @useResource
    this.app.singleton(
      symbols.INJECTORS.RESOURCE,
      name => this.app.get(`resource.${name}`),
      true,
    );

    // for @useComponent
    this.app.singleton(
      symbols.INJECTORS.COMPONENT,
      name => this.app.get(`component.${name}`),
      true,
    );
  }
}

module.exports = ComponentProvider;
