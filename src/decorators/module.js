/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const Controller = require('../controller');
const Metadata = require('../foundation/support/metadata');

function injectClass(elementDescriptor) {
  return {
    ...elementDescriptor,
    // elements: [
    //   ...elementDescriptor.elements,
    //   {
    //     kind: 'method',
    //     key: 'run',
    //     placement: 'prototype',
    //     descriptor: {
    //       value(item) {
    //         if (!this.controllers) this.controllers = [];
    //         this.controllers.push(item);
    //       },
    //       writable: true,
    //       configurable: true,
    //       enumerable: false,
    //     },
    //   },
    // ],
    finisher(target) {
      Reflect.setMetadata('isModule', true, target.prototype);

      // Metadata.set('controller', new Controller(), target.prototype);

      target.prototype.run = function (item) {
        if (!this.controllers) this.controllers = [];
        this.controllers.push(item);
      };

      Metadata.set('controller', new Controller(), target.prototype);

      // if (Metadata.has('controller', target.prototype)) {
      //   Metadata.set('controller', new Controller(), target.prototype);
      // }
      // const _Controller = Metadata.get('controller', target.prototype);
      return target;
      // return class extends target {
      //   constructor() {
      //     super();
      //     this.resolve();
      //   }

      //   resolve() {
      //     if (super.resolve && typeof super.resolve === 'function') {
      //       super.resolve();
      //     }
      //   }

      //   loadModule(_module) {
      //     this.modules.push(_module);
      //   }

      //   loadController(controller) {
      //     _Controller.register(controller);
      //   }

      //   run(item) {
      //     console.log(item);
      //     this.loadController(item);
      //   }
      // };
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
