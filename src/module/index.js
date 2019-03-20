const path = require('path')
const glob = require('glob')
const Container = require('../container')
const IllegalArgumentError = require('../errors/illegal-argument-error')
const symbols = require('../symbol')
const Meta = require('../foundation/support/meta')
const injectFactory = require('../foundation/injector/factory')

/**
 * {
 *  controller: {}
 *  middlewares: []
 * }
 */

class Module {
  app = Container.get('app');

  root = 'app.module';

  resolve = null;

  constructor() {
    const realRootModulePath = path.resolve(this.app.appPath, this.root)
    const resolve = require.resolve(realRootModulePath)
    const Mod = require(resolve)
    this.loadModuleProperties(new Mod())
    // console.log(this.app.tagged('controller'))
    // console.log(this.app.tagged('modules').map(m => Meta.get('middlewares', m)))
  }

  loadModuleProperties(ModuleInstance) {
    const middlewares = this.getMiddlewares(ModuleInstance)
    this.loadControllers(ModuleInstance, middlewares)
    this.loadSubModules(ModuleInstance)
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  loadSubModules(ModuleInstance) {
    const modules = this.getModuleModules(ModuleInstance)
    for (const Mod of modules) {
      this.loadModuleProperties(new Mod())
    }
  }

  /**
   * get module controllers use glob
   */
  loadControllers(ModuleInstance, middlewares) {
    const controllersProp = ModuleInstance.controllers || []
    if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!')
    for (const controllerProp of controllersProp) {
      // 如果是字符串，标识路径
      if (typeof controllerProp === 'string') {
        const klawControllers = glob.sync(path.resolve(this.app.controllerPath, controllerProp), {
          nodir: true
        })
        for (const controller of klawControllers) {
          const Ctrl = require(controller)
          Meta.set('middlewares', middlewares, Ctrl.prototype)
          this.bindControllerInContainer(Ctrl)
        }
      } else {
        Meta.set('middlewares', middlewares, controllerProp.prototype)
        this.bindControllerInContainer(controllerProp)
      }
    }
  }

  bindControllerInContainer(Controller) {
    this.app.bind(Controller, (ctx) => {
      return injectFactory(Controller, ctx)
      // return new Controller()
    })
    this.app.tag(Controller, 'controllerCallback')
  }

  patchModule(Mod, parentModuleInstance) {
    // 向下传递中间件
    const parentModuleMiddlewares = [].concat(parentModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [], parentModuleInstance.middlewares || [])
    Mod.prototype[symbols.MODULE_PARENT_MIDDLEWARES] = parentModuleMiddlewares
    return Mod
  }

  getModuleModules(ModuleInstance) {
    const modulesProp = ModuleInstance.modules || []
    if (!Array.isArray(modulesProp)) throw new Error('Module s modules prop must be an Array!')
    let modules = []
    for (const moduleProp of modulesProp) {
      // 如果是字符串，标识路径
      if (typeof moduleProp === 'string') {
        const klawModules = glob.sync(path.resolve(this.app.appPath, moduleProp), {
          nodir: true
        })
        modules = modules.concat(klawModules.map(m => {
          const Mod2 = require(m)
          return this.patchModule(Mod2, ModuleInstance)
        }))
      } else {
        modules.push(this.patchModule(moduleProp, ModuleInstance))
      }
    }
    return modules
  }

  getMiddlewares(ModuleInstance) {
    const middlewaresProp = [].concat(ModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [], ModuleInstance.middlewares || [])
    if (!Array.isArray(middlewaresProp)) throw new Error('Module s middlewares prop must be an Array!')
    const middlewares = []
    for (const middlewareProp of middlewaresProp) {
      // 如果是字符串，标识路径
      if (typeof middlewareProp === 'string') {
        const mid = require(path.resolve(this.app.middlewarePath, middlewareProp))
        middlewares.push(mid)
      } else {
        middlewares.push(middlewareProp)
      }
    }
    return middlewares
  }
}


module.exports = Module
