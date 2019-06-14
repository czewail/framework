const Component = require('../../component');
const symbols = require('../../symbol');

class ComponentProvider {
  /**
   * create Component Provider
   * @param {object} app Application
   */
  constructor(app) {
    /**
     * @var {object} app Application
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
      (name, request) => this.app.get(`service.${name}`, [request]),
      true,
    );

    // for @useService
    this.app.singleton(
      symbols.INJECTORS.RESOURCE,
      (name, request) => this.app.get(`resource.${name}`, [request]),
      true,
    );

    // for @useService
    this.app.singleton(
      symbols.INJECTORS.COMPONENT,
      (name, request) => this.app.get(`component.${name}`, [request]),
      true,
    );
  }
}

module.exports = ComponentProvider;
