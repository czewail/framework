const path = require('path');
const glob = require('glob');
const is = require('core-util-is');
const Container = require('../container');
const symbols = require('../symbol');
const Meta = require('../foundation/support/meta');
const { patchModule } = require('./helpers');

/**
 * {
 *  controller: {}
 *  middlewares: []
 * }
 */
class Module {
  /**
   * Create Module
   */
  constructor() {
    this.app = Container.get('app');

    this.loadModules();
  }

  /**
   * load application modules
   */
  loadModules() {
    for (const mdl of this.app.modules) {
      this.register(mdl);
    }
  }

  /**
   * register a module
   * @param {STring | Class} mdl
   */
  register(mdl) {
    if (is.isString(mdl)) {
      this.parseStringModule(mdl);
    } else if (is.isFunction(mdl)) {
      this.parseFunctionModule(mdl);
    }
  }

  /**
   * parse module if typeof string
   * @param {String} mdl
   */
  parseStringModule(mdl) {
    const modulePath = require.resolve(path.join(this.app.appPath, mdl));
    // eslint-disable-next-line global-require, import/no-dynamic-require
    this.parseFunctionModule(require(modulePath));
  }

  /**
   * parse module if typeof function
   * @param {Function} mdl
   */
  parseFunctionModule(Mdl) {
    // 使用了 @module 装饰器
    if (Mdl.prototype && Meta.has('isModule', Mdl.prototype) && Meta.get('isModule', Mdl.prototype) === true) {
      this.loadModuleProperties(new Mdl());
      return this;
    }
    throw new TypeError('unsupport module');
  }

  /**
   * load module Props
   * @param {Object} ModuleInstance module instance
   */
  loadModuleProperties(ModuleInstance) {
    const middlewares = this.getMiddlewares(ModuleInstance);
    this.parsePropertyControllers(ModuleInstance, middlewares);
    this.parsePropertyModules(ModuleInstance);
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  parsePropertyModules(ModuleInstance) {
    const propertyModules = this.getModuleModules(ModuleInstance);
    for (const Mod of propertyModules) {
      this.loadModuleProperties(new Mod());
    }
  }

  /**
   * get module controllers use glob
   * @param {Object} module instance
   * @param {Array} middlewares module middlewares
   */
  parsePropertyControllers(ModuleInstance, middlewares) {
    const controllersProp = ModuleInstance.controllers || [];
    if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!');
    for (const controllerProp of controllersProp) {
      // 如果是字符串，标识路径
      if (typeof controllerProp === 'string') {
        const klawControllers = glob.sync(path.resolve(this.app.controllerPath, controllerProp), {
          nodir: true,
        });
        for (const controller of klawControllers) {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          const Ctrl = require(controller);
          const metaMiddlewares = Meta.get('middlewares', Ctrl.prototype) || [];
          Meta.set('middlewares', [...middlewares, ...metaMiddlewares], Ctrl.prototype);
          this.app.get('controller').register(Ctrl);
        }
      } else {
        const metaMiddlewares = Meta.get('middlewares', controllerProp.prototype) || [];
        Meta.set('middlewares', [...middlewares, ...metaMiddlewares], controllerProp.prototype);
        this.app.get('controller').register(controllerProp);
      }
    }
  }

  // /**
  //  * bind controller in container
  //  * @param {Class} Controller controller
  //  */
  // bindControllerInContainer(Controller) {
  //   this.app.multiton(Controller, Controller);
  //   this.app.tag(Controller, 'controller');
  // }

  /**
   * get module subModules
   * @param {Object} ModuleInstance module instance
   */
  getModuleModules(ModuleInstance) {
    const modulesProp = ModuleInstance.modules || [];
    if (!Array.isArray(modulesProp)) throw new Error('Module s modules prop must be an Array!');
    let modules = [];
    for (const moduleProp of modulesProp) {
      // 如果是字符串，标识路径
      if (typeof moduleProp === 'string') {
        const klawModules = glob.sync(path.resolve(this.app.appPath, moduleProp), {
          nodir: true,
        });
        modules = modules.concat(klawModules.map((m) => {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          const Mod2 = require(m);
          return patchModule(Mod2, ModuleInstance);
        }));
      } else {
        modules.push(patchModule(moduleProp, ModuleInstance));
      }
    }
    return modules;
  }

  /**
   * get module middlewares
   * @param {Object} ModuleInstance module instance
   */
  getMiddlewares(ModuleInstance) {
    return [].concat(
      ModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [],
      ModuleInstance.middlewares || [],
    );
  }
}


module.exports = Module;
