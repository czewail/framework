const Decorators = require('./decorators')
const Controller = require('./base/controller')
const Service = require('./base/service')
const Middleware = require('./base/middleware')
const Container = require('./container')
const HttpError = require('./errors/http-error')

class Daze {
  constructor() {
    this.application = Container.get('app')
  }

  // Mark: Base

  get Controller() {
    return Controller
  }

  get Service() {
    return Service
  }

  get Middleware() {
    return Middleware
  }

  // Mark: Container

  get app() {
    return this.application
  }

  get config() {
    return this.application.get('config')
  }

  get messenger() {
    return this.application.get('messenger')
  }

  // MARK: Decorators

  get Decorators() {
    return {
      get Inject() {
        return Decorators.Inject
      },
      get Req() {
        return Decorators.Req
      },
      get Res() {
        return Decorators.Res
      },
      get Ctx() {
        return Decorators.Ctx
      },
      get Session() {
        return Decorators.Session
      },
      get Cookie() {
        return Decorators.Cookie
      },
      get Redirect() {
        return Decorators.Redirect
      },
      get HttpCode() {
        return Decorators.HttpCode
      },
      get Transform() {
        return Decorators.Transform
      },
      get Transformer() {
        return Decorators.Transformer
      },
      get App() {
        return Decorators.App
      },
      get Config() {
        return Decorators.Config
      },
      get Router() {
        return Decorators.Router
      },
      get Koa() {
        return Decorators.Koa
      },
      get Middleware() {
        return Decorators.Middleware
      },
      get Response() {
        return Decorators.Response
      },
      get Service() {
        return Decorators.Service
      },
      get View() {
        return Decorators.View
      },
      get Post() {
        return Decorators.Post
      },
      get Get() {
        return Decorators.Get
      },
      get Patch() {
        return Decorators.Patch
      },
      get Delete() {
        return Decorators.Delete
      },
      get Del() {
        return Decorators.Del
      },
      get Option() {
        return Decorators.Option
      },
      get Head() {
        return Decorators.Head
      },
      get All() {
        return Decorators.All
      },
      get Put() {
        return Decorators.Put
      },
      get Rest() {
        return Decorators.Rest
      },
      get Body() {
        return Decorators.Body
      },
      get Params() {
        return Decorators.Params
      },
      get Query() {
        return Decorators.Query
      },
      get Headers() {
        return Decorators.Headers
      }
    }
  }

  // helpers

  abort(code = 500, message = '', errors = []) {
    throw new HttpError(code, message, errors)
  }
}

module.exports = Daze
