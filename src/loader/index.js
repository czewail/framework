/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const path = require('path');
const glob = require('glob');
// const is = require('core-util-is');

class Loader {
  /**
   * Create AutoScan Instance
   */
  constructor(app) {
    /**
     * @var {object} app Application
     */
    this.app = app;

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

    // /**
    //  * @var {array} providers providers
    //  */
    // this.providers = [];
  }

  autoLoadApp() {
    const appFiles = glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });

    for (const file of appFiles) {
      this.loadFile(file);
    }
  }

  // autoLoadProvider() {
  //   const providerFiles = glob.sync(path.resolve(this.app.rootPath, 'provider', '**'), {
  //     nodir: true,
  //   });

  //   for (const file of providerFiles) {
  //     this.loadFile(file);
  //   }
  // }

  /**
   * resolve auto scan
   */
  async resolve() {
    this.autoLoadApp();
    // this.autoLoadProvider();

    // await this.registerProviders();
    // register middlewares
    // middlewares must be registed before controller
    this.registerMiddlewares();
    // register components
    this.registerComponents();
    // register controllers
    this.registerControllers();
  }

  /**
   * load file with filepath
   * @param {string} filePath
   */
  loadFile(filePath) {
    const realPath = require.resolve(filePath);
    // eslint-disable-next-line
    const target = require(realPath);
    if (!target || !target.prototype) return;
    const isIgnore = Reflect.getMetadata('ignore', target.prototype);
    if (isIgnore === true) return;
    const type = Reflect.getMetadata('type', target.prototype);
    this.parseModule(target, type);
  }

  /**
   * parse file module
   * @param {*} target
   * @param {string} type controller | middleware | service | resource | validator | component
   */
  parseModule(target, type) {
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
      // case 'provider':
      //   this.providers.push(target);
      //   break;
      default:
        break;
    }
  }

  /**
   * register middlewares
   */
  registerMiddlewares() {
    for (const middleware of this.middlewares) {
      const type = Reflect.getMetadata('name', middleware.prototype);
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

  // /**
  //  * register provider
  //  * @param {class} Provider provider
  //  */
  // async registerProviders() {
  //   const promises = [];
  //   for (const Provider of this.providers) {
  //     this.promises.push(this.app.register(new Provider(this.app)));
  //   }
  //   await Promise.all(promises);
  // }
}

module.exports = Loader;
