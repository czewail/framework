const path = require('path')
const glob = require('glob')
const Container = require('../container')
const IllegalArgumentError = require('../errors/illegal-argument-error')
const symbols = require('../symbol')

class Module {
  app = Container.get('app');

  controllers = [];

  modules = [];

  constructor() {
    this.parseModules()
  }

  parseModules() {
    const rootModulePaths = this.app.get('config').get('app.modules', [])
    if (!Array.isArray(rootModulePaths)) throw new IllegalArgumentError('Illegal modules config')
    for (const rootModuePath of rootModulePaths) {
      const realRootModulePath = path.resolve(this.app.appPath, rootModuePath)
      if (require.resolve(realRootModulePath)) {
        const CurrentModule = require(realRootModulePath)
        const mod = new CurrentModule()
        this.modules.push(mod)
      }
    }
  }

  loadModules() {
    for (const mod of this.modules) {
      this.loadModuleProperties(mod)
    }
  }

  loadModuleProperties(ModuleInstance) {
    const controllers = this.getControllers(ModuleInstance)
    const middlewares = this.getMiddlewares(ModuleInstance)
    this.loadControllers(controllers, middlewares)
    // this.loadSubModules(ModuleInstance)
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  loadSubModules(ModuleInstance) {
    const modules = this.getModuleModules(ModuleInstance)
    for (const _module of modules) {
      this.loadModuleProperties(_module)
    }
  }

  /**
   * Load the controllers
   *
   * @param {array} controllers
   * @param {array} middlewares
   */
  loadControllers(controllers, middlewares) {
    for (const _controller of controllers) {
      this.loadControllerMethods(_controller, middlewares)
    }
  }

  /**
   * Load the controller method
   * @param {object} controller controller instance
   */
  loadControllerMethods(Controller, moduleMiddlewares) {
    const isRoute = Controller.prototype[symbols.ISROUTE] || false
    const prefix = Controller.prototype[symbols.PREFIX] || ''
    const routes = Controller.prototype[symbols.ROUTES] || []
    const middlewares = Controller.prototype[symbols.MIDDLEWARES] || []

    if (isRoute === true) {
      // const parsedControllerMiddlewares = this.parseMiddlewares(middlewares)
      // const parsedModuleMiddlewares = this.parseMiddlewares(moduleMiddlewares)

      // const combinedMidllewares = [...parsedModuleMiddlewares, ...parsedControllerMiddlewares]

      console.log(routes)
    }
  }


  /**
   * get module controllers use glob
   */
  getControllers(ModuleInstance) {
    const controllersProp = ModuleInstance.controllers || []
    if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!')
    let controllers = []
    for (const controllerProp of controllersProp) {
      // 如果是字符串，标识路径
      if (typeof controllerProp === 'string') {
        const klawControllers = glob.sync(path.resolve(this.app.controllerPath, controllerProp), {
          nodir: true
        })
        controllers = controllers.concat(klawControllers.map(controller => require(controller)))
      } else {
        controllers.push(controllerProp)
      }
    }
    return controllers
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
      if (typeof controllerProp === 'string') {
        const klawModules = glob.sync(path.resolve(this.app.appPath, moduleProp), {
          nodir: true
        })
        modules = modules.concat(klawModules.map(m => {
          const Mod2 = require(m)
          return exports.patchModule(Mod2, ModuleInstance)
        }))
      } else {
        modules.push(exports.patchModule(moduleProp, ModuleInstance))
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
        // 绝对路径
        if (path.isAbsolute(middlewareProp)) {
          const mid = require(middlewareProp)
          middlewares.push(mid)
        } else {
          // 相对路径
          const mid = require(path.resolve(this.app.middlewarePath, middlewareProp))
          middlewares.push(mid)
        }
      } else {
        middlewares.push(middlewareProp)
      }
    }
    return middlewares
  }
}


module.exports = Module
