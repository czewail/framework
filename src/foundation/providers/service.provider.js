const path = require('path');
const symbols = require('../../symbol');

class ServiceProvider {
  /**
   * create Service Provider
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
    this.app.singleton(
      symbols.INJECTORS.SERVICE,
      (servicePath, args = [], force = false, request) => {
        const resolvePath = path.resolve(this.app.servicePath, servicePath);
        if (!this.app.has(resolvePath)) {
          // eslint-disable-next-line
          const requiredService = require(resolvePath);
          this.app.bind(resolvePath, requiredService);
        }
        return this.app.get(resolvePath, args, [request], force);
      },
      true,
    );
  }
}

module.exports = ServiceProvider;
