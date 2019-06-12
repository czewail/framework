const path = require('path');
const glob = require('glob');
const is = require('core-util-is');
const Container = require('../container');
const { patchModule } = require('./helpers');
const Controller = require('../controller');
const Metadata = require('../foundation/support/metadata');

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

    this.modules = [];

    // this.loadModules();
  }

  // /**
  //  * load application modules
  //  */
  // loadModules() {
  //   for (const mdl of this.app.modules) {
  //     this.register(mdl);
  //   }
  // }

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
  parseFunctionModule(_Module) {
    // 使用了 @module 装饰器
    if (!Reflect.getMetadata('isModule', _Module.prototype)) return this;

    this.modules.push(_Module);

    this.app.bind(_Module, _Module);
    // this.registerControllers(_Module);
    return this;
  }

  resolve() {
    for (const _Module of this.modules) {
      const moduleInstance = this.app.get(_Module);
      moduleInstance.resolve();
      const _ControllerManager = Metadata.get('controller', _Module.prototype);
      const controllers = moduleInstance.controllers || [];
      for (const controller of controllers) {
        _ControllerManager.register(controller);
      }
      _ControllerManager.resolve();
    }
  }

  // /**
  //  * load module Props
  //  * @param {Object} ModuleInstance module instance
  //  */
  // loadModuleProperties(_Module) {
  //   const _Middleware = getModuleMiddleware(_Module.prototype);
  //   const ModuleInstance = new _Module();
  //   this.parsePropertyControllers(ModuleInstance, _Middleware);
  //   this.parsePropertyModules(ModuleInstance);
  // }

  // /**
  //  * Load all sub-modules
  //  * @param {object} ModuleInstance
  //  */
  // parsePropertyModules(ModuleInstance) {
  //   const propertyModules = this.getModuleModules(ModuleInstance);
  //   for (const Mod of propertyModules) {
  //     if (isModule(Mod.prototype)) {
  //       this.loadModuleProperties(Mod);
  //     }
  //   }
  // }

  // /**
  //  * get module controllers use glob
  //  * @param {Object} module instance
  //  * @param {Array} middlewares module middlewares
  //  */
  // parsePropertyControllers(ModuleInstance, _Middleware) {
  //   const controllersProp = ModuleInstance.controllers || [];
  //   if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!');
  //   for (const controllerProp of controllersProp) {
  //     // 如果是字符串，标识路径
  //     if (typeof controllerProp === 'string') {
  //       const klawControllers = glob.sync(path.resolve(this.app.controllerPath, controllerProp), {
  //         nodir: true,
  //       });
  //       for (const controller of klawControllers) {
  //         // eslint-disable-next-line global-require, import/no-dynamic-require
  //         const Ctrl = require(controller);
  //         const metaMiddlewares = getMiddlewares(Ctrl.prototype);
  //         setMiddlewares(Ctrl.prototype, [...middlewares, ...metaMiddlewares]);
  //         this.app.get('controller').register(Ctrl);
  //       }
  //     } else {
  //       const metaMiddlewares = getMiddlewares(controllersProp.prototype);
  //       setMiddlewares(controllerProp.prototype, [...middlewares, ...metaMiddlewares]);
  //       this.app.get('controller').register(controllerProp);
  //     }
  //   }
  // }

  // /**
  //  * get module subModules
  //  * @param {Object} ModuleInstance module instance
  //  */
  // getModuleModules(ModuleInstance) {
  //   const modulesProp = ModuleInstance.modules || [];
  //   if (!Array.isArray(modulesProp)) throw new Error('Module s modules prop must be an Array!');
  //   let modules = [];
  //   for (const moduleProp of modulesProp) {
  //     // 如果是字符串，标识路径
  //     if (typeof moduleProp === 'string') {
  //       const klawModules = glob.sync(path.resolve(this.app.appPath, moduleProp), {
  //         nodir: true,
  //       });
  //       modules = modules.concat(klawModules.map((m) => {
  //         // eslint-disable-next-line global-require, import/no-dynamic-require
  //         const Mod2 = require(m);
  //         return patchModule(Mod2, ModuleInstance);
  //       }));
  //     } else {
  //       modules.push(patchModule(moduleProp, ModuleInstance));
  //     }
  //   }
  //   return modules;
  // }
}


module.exports = Module;
