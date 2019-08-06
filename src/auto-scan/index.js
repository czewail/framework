/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const path = require('path');
const glob = require('glob');
const Container = require('../container');

class AutoScan {
  /**
   * Create AutoScan Instance
   * @param {Application} app Applidation Instance
   */
  constructor() {
    /**
     * @var {object} app Application
     */
    this.app = Container.get('app');

    /**
     * @var {array} controllers controllers
     */
    this.controllers = [];

    /**
     * @var {array} middlewares middlewares
     */
    this.middlewares = [];

    /**
     * @var {array} components components
     */
    this.components = [];
  }

  /**
   * resolve auto scan
   */
  resolve() {
    // load src/app dir files
    this.resolveAppFiles(this.scanAppDir());
    // load provider dir files
    this.resolveProviderFiles(this.scanProviderDir());

    // register middlewares
    // middlewares must be registed before controller
    this.registerMiddlewares();
    // register components
    this.registerComponents();
    // register controllers
    this.registerControllers();
  }

  /**
   * resolve app dir files
   * @param {array} files app dir files
   */
  resolveAppFiles(files = []) {
    for (const file of files) {
      // eslint-disable-next-line
      const target = require(file);
      if (target && target.prototype) {
        const isIgnore = Reflect.getMetadata('ignore', target.prototype);
        if (isIgnore === true) return this;
        const type = Reflect.getMetadata('type', target.prototype);
        switch (type) {
          case 'controller':
            this.controllers.push(target);
            break;
          case 'middleware':
            this.middlewares.push(target);
            break;
          case 'service':
          case 'resource':
          case 'validator':
          case 'component':
            this.components.push(target);
            break;
          default:
            break;
        }
      }
    }
    return this;
  }

  /**
   * resolve provider dir files
   * @param {array} files provider dir files
   */
  resolveProviderFiles(files = []) {
    for (const file of files) {
      // eslint-disable-next-line
      const target = require(file);
      if (typeof target === 'function') {
        const isIgnore = Reflect.getMetadata('ignore', target.prototype);
        if (isIgnore === true) return this;
        this.registerProvider(target, file);
      }
    }
    return this;
  }

  /**
   * auto scan provider dir
   */
  scanProviderDir() {
    return glob.sync(path.resolve(this.app.rootPath, 'provider', '**'), {
      nodir: true,
    });
  }

  /**
   * auto scan app dir
   */
  scanAppDir() {
    return glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });
  }

  /**
   * register middlewares
   */
  registerMiddlewares() {
    for (const middleware of this.middlewares) {
      const type = Reflect.getMetadata('middlewareName', middleware.prototype);
      this.app.bind(`middleware.${type}`, middleware);
    }
  }

  /**
   * register controllers
   */
  registerControllers() {
    for (const controller of this.controllers) {
      this.app.get('controller').register(controller);
    }
  }

  /**
   * register components
   */
  registerComponents() {
    for (const component of this.components) {
      this.app.get('component').register(component);
    }
  }

  /**
   * register provider
   * @param {class} Provider provider
   */
  registerProvider(Provider) {
    this.app.register(new Provider(this.app));
  }
}

module.exports = AutoScan;
