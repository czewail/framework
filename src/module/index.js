const path = require('path');
const glob = require('glob');
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
  constructor() {
    this.app = Container.get('app');
    this.root = 'app.module';
    this.loadRootModule();
  }

  /**
   * load root module
   */
  loadRootModule() {
    const realRootModulePath = path.resolve(this.app.appPath, this.root);
    const resolve = require.resolve(realRootModulePath);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const Mod = require(resolve);
    this.loadModuleProperties(new Mod());
  }

  /**
   * load module Props
   * @param {Object} ModuleInstance module instance
   */
  loadModuleProperties(ModuleInstance) {
    const middlewares = this.getMiddlewares(ModuleInstance);
    this.loadControllers(ModuleInstance, middlewares);
    this.loadSubModules(ModuleInstance);
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  loadSubModules(ModuleInstance) {
    const modules = this.getModuleModules(ModuleInstance);
    for (const Mod of modules) {
      this.loadModuleProperties(new Mod());
    }
  }

  /**
   * get module controllers use glob
   * @param {Object} module instance
   * @param {Array} middlewares module middlewares
   */
  loadControllers(ModuleInstance, middlewares) {
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
          Meta.set('middlewares', middlewares, Ctrl.prototype);
          this.bindControllerInContainer(Ctrl);
        }
      } else {
        Meta.set('middlewares', middlewares, controllerProp.prototype);
        this.bindControllerInContainer(controllerProp);
      }
    }
  }

  /**
   * bind controller in container
   * @param {Class} Controller controller
   */
  bindControllerInContainer(Controller) {
    this.app.bind(Controller, Controller);
    this.app.tag(Controller, 'controller');
  }

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
    // if (!Array.isArray(middlewaresProp)) throw new Error('Module s middlewares prop must be an Array!');
    // const middlewares = [];
    // for (const middlewareProp of middlewaresProp) {
    //   // 如果是字符串，标识路径
    //   if (typeof middlewareProp === 'string') {
    //     // eslint-disable-next-line global-require, import/no-dynamic-require
    //     const mid = require(path.resolve(this.app.middlewarePath, middlewareProp));
    //     middlewares.push(mid);
    //   } else {
    //     middlewares.push(middlewareProp);
    //   }
    // }
    // return middlewares;
  }
}


module.exports = Module;
