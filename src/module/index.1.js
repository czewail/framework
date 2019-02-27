const path = require('path')
const glob = require('glob')
const Container = require('../container')
const IllegalArgumentError = require('../errors/illegal-argument-error')
const symbols = require('../symbol')
const Meta = require('../foundation/support/meta')

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

  items = [];

  modules = [];

  constructor() {
    const realRootModulePath = path.resolve(this.app.appPath, this.root)
    const resolve = require.resolve(realRootModulePath)
    const Mod = require(resolve)
    this.loadModuleProperties(new Mod())
    // console.log(this.app.tagged('modules').map(m => Meta.get('middlewares', m)))
  }

  loadModuleProperties(ModuleInstance) {
    const controllers = this.getControllers(ModuleInstance)
    const middlewares = this.getMiddlewares(ModuleInstance)
    Meta.set('controllers', controllers, ModuleInstance)
    Meta.set('middlewares', middlewares, ModuleInstance)
    this.app.bind(ModuleInstance, ModuleInstance)
    this.app.tag(ModuleInstance, 'modules')
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

  // /**
  //  * Load the controllers
  //  *
  //  * @param {array} controllers
  //  * @param {array} middlewares
  //  */
  // loadControllers(controllers, middlewares) {
  //   const mod = { controllers, middlewares }
  //   this.app.bind(mod, mod)
  //   this.app.tag(mod, 'modules')
  //   for (const _controller of controllers) {
  //     const mod = {
  //       controller: _controller,
  //       middlewares
  //     }
  //     this.items.push(mod)
  //     // this.loadControllerMethods(_controller, middlewares)
  //   }
  // }

  // /**
  //  * Load the controller method
  //  * @param {object} controller controller instance
  //  */
  // loadControllerMethods(Controller, moduleMiddlewares) {
  //   console.log(Meta.get(Controller.prototype))

  //   const isRoute = Controller.prototype[symbols.ISROUTE] || false
  //   const prefix = Controller.prototype[symbols.PREFIX] || ''
  //   const routes = Controller.prototype[symbols.ROUTES] || []
  //   const middlewares = Controller.prototype[symbols.MIDDLEWARES] || []

  //   if (isRoute === true) {
  //     // const parsedControllerMiddlewares = this.parseMiddlewares(middlewares)
  //     // const parsedModuleMiddlewares = this.parseMiddlewares(moduleMiddlewares)

  //     // const combinedMidllewares = [...parsedModuleMiddlewares, ...parsedControllerMiddlewares]

  //     console.log(routes)
  //   }
  // }


  /**
   * get module controllers use glob
   */
  getControllers(ModuleInstance) {
    const controllersProp = ModuleInstance.controllers || []
    if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!')
    const controllers = []
    for (const controllerProp of controllersProp) {
      // 如果是字符串，标识路径
      if (typeof controllerProp === 'string') {
        const klawControllers = glob.sync(path.resolve(this.app.controllerPath, controllerProp), {
          nodir: true
        })
        for (const controller of klawControllers) {
          controllers.push(require(controller))
        }
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
