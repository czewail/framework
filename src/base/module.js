const path = require('path')
const glob = require('glob')
const Container = require('../container')

class Module {
  app = Container.get('app');

  getControllers() {
    const controllersProp = this.controllers || []
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

  getMiddlewares() {
    const middlewaresProp = this.middlewares || []
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
