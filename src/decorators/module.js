/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const { letModule } = require('../module/helpers');

function injectClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      letModule(target.prototype);

      return class extends target {
        constructor() {
          super();
          this.controllers = [];
          this.modules = [];
          this.resolve();
        }

        resolve() {
          if (super.resolve && typeof super.resolve === 'function') {
            super.resolve();
          }
        }

        loadModule(_module) {
          this.modules.push(_module);
        }

        loadController(controller) {
          this.controllers.push(controller);
        }

        run(controller) {
          this.loadController(controller);
        }
      };
    },
  };
}

function handle(elementDescriptor) {
  if (elementDescriptor.kind === 'class') {
    return injectClass(elementDescriptor);
  }
  return elementDescriptor;
}

module.exports = function Module() {
  return elementDescriptor => handle(elementDescriptor);
};
