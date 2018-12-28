
const path = require('path')
const glob = require('glob')

const { MODULE_PARENT_MIDDLEWARES } = require('../symbol')

/**
 * get module controllers use glob
 */
exports.getModuleControllers = function (app, ModuleInstance) {
  const controllersProp = ModuleInstance.controllers || []
  if (!Array.isArray(controllersProp)) throw new Error('Module s controller prop must be an Array!')
  let controllers = []
  for (const controllerProp of controllersProp) {
    // 如果是字符串，标识路径
    if (typeof controllerProp === 'string') {
      // 绝对路径
      if (path.isAbsolute(controllerProp)) {
        const klawControllers = glob.sync(controllerProp, {
          nodir: true
        })
        controllers = controllers.concat(klawControllers.map(controller => require(controller)))
      } else {
        // 相对路径
        const klawControllers = glob.sync(path.resolve(app.controllerPath, controllerProp), {
          nodir: true
        })
        controllers = controllers.concat(klawControllers.map(controller => require(controller)))
      }
    } else {
      controllers.push(controllerProp)
    }
  }
  return controllers
}

exports.patchModule = function (Module, parentModuleInstance) {
  // 向下传递中间件
  const parentModuleMiddlewares = [].concat(parentModuleInstance[MODULE_PARENT_MIDDLEWARES] || [], parentModuleInstance.middlewares || [])
  Module.prototype[MODULE_PARENT_MIDDLEWARES] = parentModuleMiddlewares
  return Module
}

exports.getModuleModules = function (app, ModuleInstance) {
  const modulesProp = ModuleInstance.modules || []
  if (!Array.isArray(modulesProp)) throw new Error('Module s modules prop must be an Array!')
  let modules = []
  for (const moduleProp of modulesProp) {
    // 如果是字符串，标识路径
    if (typeof controllerProp === 'string') {
      // 绝对路径
      if (path.isAbsolute(moduleProp)) {
        const klawModules = glob.sync(moduleProp, {
          nodir: true
        })
        modules = modules.concat(klawModules.map(m => {
          const Module = require(m)
          return exports.patchModule(Module, ModuleInstance)
        }))
      } else {
        // 相对路径
        const klawModules = glob.sync(path.resolve(app.appPath, moduleProp), {
          nodir: true
        })
        modules = modules.concat(klawModules.map(m => {
          const Module = require(m)
          return exports.patchModule(Module, ModuleInstance)
        }))
      }
    } else {
      modules.push(exports.patchModule(moduleProp, ModuleInstance))
    }
  }
  return modules
}

exports.getModuleMiddlewares = function (app, ModuleInstance) {
  const middlewaresProp = [].concat(ModuleInstance[MODULE_PARENT_MIDDLEWARES] || [], ModuleInstance.middlewares || [])
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
        const mid = require(path.resolve(app.middlewarePath, middlewareProp))
        middlewares.push(mid)
      }
    } else {
      middlewares.push(middlewareProp)
    }
  }
  return middlewares
}
