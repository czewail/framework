/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path');
const symbols = require('../../symbol');

class ServiceProvider {
  /**
   * create Service Provider
   * @param {Object} app Application
   */
  constructor(app) {
    /**
     * @var {Object} app Application
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
