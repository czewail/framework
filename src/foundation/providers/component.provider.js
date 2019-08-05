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
