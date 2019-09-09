/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const path = require('path');
const glob = require('glob');
const verifyCsrfToken = require('../foundation/middlewares/verify-csrf-token');

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
     * 默认加载的中间件
     * @var {array} middlewares middlewares
     */
    this.middlewares = [
      verifyCsrfToken,
    ];

    /**
     * @var {array} components components
     */
    this.components = [];
  }

  /**
   * auto scan app dir
   */
  autoLoadApp() {
    const appFiles = glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });

    for (const file of appFiles) {
      this.loadFile(file);
    }
  }

  /**
   * resolve auto scan
   */
  resolve() {
    this.autoLoadApp();
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
      default:
        break;
    }
  }

  /**
   * load Middleware
   * @param {class} target
   */
  loadMiddleware(target) {
    const name = Reflect.getMetadata('name', target.prototype);
    if (!name) return;
    this.app.bind(`middleware.${name}`, target);
  }

  /**
   * register middlewares
   */
  registerMiddlewares() {
    for (const middleware of this.middlewares) {
      this.loadMiddleware(middleware);
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
      const name = Reflect.getMetadata('name', component.prototype);
      const type = Reflect.getMetadata('type', component.prototype);
      if (name && type) {
        this.app.bind(`${type}.${name}`, component);
      }
    }
  }
}

module.exports = Loader;
