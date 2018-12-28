/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path')
const pathToRegexp = require('path-to-regexp')
const is = require('is-type-of')
const cluster = require('cluster')
const koaBody = require('koa-body')
const Router = require('koa-router')
const cors = require('koa2-cors')
const session = require('koa-session')
const serve = require('koa-static')
const mount = require('koa-mount')
const nunjucks = require('nunjucks')
const Tokens = require('csrf')
const Keygrip = require('keygrip')
const Container = require('../container')
const Daze = require('../daze')
const { Master, Worker } = require('../cluster')
const ExceptionHandler = require('../errors/handle')
const HttpError = require('../errors/http-error')
const { ROUTES, PREFIX, ISROUTE, MIDDLEWARES, SESSION_FLASHS, SESSION_FLASHED, SESSION_PREVIOUS_URL, SESSION_CURRENT_URL, HTTP_CODE } = require('../symbol')
const { getModuleControllers, getModuleModules, getModuleMiddlewares } = require('./helpers')
const injectorContextFactory = require('./injector/context-factory')
const ResponseFactory = require('../response/factory')
const injectorFactory = require('./injector/factory')
const sessionDrivers = require('../session/drivers')

const VERSION = '0.7.2'
const DEFAULT_PORT = 8000

class Application extends Container {
  constructor(rootPath, paths = {}) {
    super()
    if (!rootPath) throw new Error('must pass the runPath parameter when you apply the instantiation!')
    this.paths = paths
    // application version
    this.version = VERSION
    // application run path
    this.rootPath = rootPath
    // koa instance
    this.koaApplication = this.make('koa')
    // config instance
    this.config = this.make('config', [this.configPath])
    // application run port
    this.port = this.config.get('app.port', DEFAULT_PORT)
    // 调试模式
    this.debug = this.config.get('app.debug', false)
    // csrf tokens
    this.csrf = new Tokens()
  }

  /**
   * getter for Configuration debug
   */
  get isDebug() {
    return this.debug
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster.enabled')
  }

  get appPath() {
    return path.resolve(this.rootPath, this.paths.app || 'app')
  }

  /**
   * getter for Configuration file path getter
   */
  get configPath() {
    return path.resolve(this.rootPath, this.paths.config || 'config')
  }

  /**
   *  getter for View file path
   */
  get viewsPath() {
    return path.resolve(this.rootPath, this.paths.views || '../views')
  }

  /**
   *  getter for public path
   */
  get publicPath() {
    return path.resolve(this.rootPath, this.paths.public || '../public')
  }

  /**
   *  getter for Controller file path
   */
  get controllerPath() {
    return path.resolve(this.rootPath, this.appPath, this.paths.controller || 'controller')
  }

  /**
   *  getter for Middleware file path
   */
  get middlewarePath() {
    return path.resolve(this.rootPath, this.appPath, this.paths.middleware || 'middleware')
  }

  /**
   *  getter for service file path
   */
  get servicePath() {
    return path.resolve(this.rootPath, this.appPath, this.paths.service || 'service')
  }

  /**
   *  getter for transformer file path
   */
  get transformerPath() {
    return path.resolve(this.rootPath, this.appPath, this.paths.transformer || 'transformer')
  }

  /**
   *  getter for validator file path
   */
  get validatePath() {
    return path.resolve(this.rootPath, this.appPath, this.paths.validate || 'validate')
  }

  /**
   *  getter for log file path
   */
  get logPath() {
    return path.resolve(this.rootPath, this.paths.log || '../logs')
  }

  // 获取集群主进程实例
  get clusterMaterInstance() {
    const clusterConfig = this.config.get('app.cluster')
    return new Master({
      port: this.port,
      workers: clusterConfig.workers || 0,
      sticky: clusterConfig.sticky || false,
    })
  }

  // 获取集群工作进程实例
  get clusterWorkerInstance() {
    const clusterConfig = this.config.get('app.cluster')
    return new Worker({
      port: this.port,
      sticky: clusterConfig.sticky || false,
      createServer: (...args) => {
        return this.startServer(...args)
      },
    })
  }


  /**
   * applicationModule getter
   */
  get rootModule() {
    const applicationModulePath = path.resolve(this.appPath, 'root.module.js')
    if (require.resolve(applicationModulePath)) {
      return this.craft(applicationModulePath)
    }
    return null
  }

  loadProviders() {
    const providers = this.config.get('provider', [])
    this.setBinds(providers)
  }

  /**
   * 注册密钥
   */
  registerSecretKey() {
    const keys = this.config.get('app.keys', [])
    const algorithm = this.config.get('app.algorithm', 'sha1')
    const encoding = this.config.get('app.encoding', 'base64')
    this.koaApplication.keys = new Keygrip(keys, algorithm, encoding)
  }

  /**
   * 注册请求时间
   */
  registerRequestTime() {
    this.koaApplication.use(async (ctx, next) => {
      // ctx.status = 500
      ctx.requestTime = new Date()
      await next()
    })
  }

  /**
   * 注册异常处理机制
   */
  registerErrorHandler() {
    // this.koaApplication.use(exceptionHandler())
    this.koaApplication.on('error', (err, ctx) => {
      const Exception = new ExceptionHandler(ctx)
      return Exception.render(err)
    })
  }

  /**
   * 注册 Cors
   */
  registerCors() {
    this.koaApplication.use(cors(this.config.get('app.cors', {})))
  }

  /**
   * 注册静态资源服务
   */
  registerStaticServer() {
    if (this.config.get('app.public') === true) {
      const publicPrefix = this.config.get('app.public_prefix', '/')
      this.koaApplication.use(mount(publicPrefix, serve(this.publicPath, {
        setHeaders(res) {
          res.setHeader('Access-Control-Allow-Origin', '*')
        }
      })))
    }
  }

  /**
   * 注册 session
   */
  registerSession() {
    const sessionConfig = this.config.get('session')
    const { type, database } = sessionConfig
    const sessionOpts = {
      ...sessionConfig
    }
    delete sessionOpts.type
    delete sessionOpts.database
    sessionOpts.store = this.getSessionDriver(type, database)
    this.koaApplication.use(session(sessionOpts, this.koaApplication))
    this.koaApplication.use((ctx, next) => {
      ctx.session[SESSION_PREVIOUS_URL] = ctx.session[SESSION_CURRENT_URL] || ''
      ctx.session[SESSION_CURRENT_URL] = ctx.request.url
      next()
    })
  }

  getSessionDriver(type, database = '') {
    let databaseConfig = this.config.get(`database.${type}`, {})
    if (database) databaseConfig = databaseConfig[database]
    switch (type) {
      case 'redis':
        return sessionDrivers.redisDriver(databaseConfig)
      default: null
    }
  }

  /**
   * 注册 request.body
   */
  registerRequestBody() {
    const bodyLimit = this.config.get('app.body_limit', '5mb')
    this.koaApplication.use(koaBody({
      multipart: true,
      stict: false,
      formLimit: bodyLimit,
      jsonLimit: bodyLimit,
      textLimit: bodyLimit,
      formidable: {
        maxFileSize: this.config.get('app.form.max_file_size', 1024 * 2014 * 2)
      }
    }))
    // this.koaApplication.use(bodyparser())
  }

  /**
   * 注册框架上下文
   */
  registerContext() {
    this.koaApplication.use(async (ctx, next) => {
      ctx.injectorContext = injectorContextFactory(this, ctx, next)
      await next()
    })
  }

  /**
   * 注册 csrf 安全密钥
   */
  registerCsrfSecret() {
    this.koaApplication.use(async (ctx, next) => {
      try {
        if (!ctx.session.secret) {
          ctx.session.secret = this.csrf.secretSync()
        }
        ctx._csrf = this.csrf.create(ctx.session.secret)
        await next()
      } catch (err) {
        this.koaApplication.emit('error', err, ctx)
      }
    })
  }

  /**
   * 注册全局中间件
   */
  registerGlobalMiddlewares() {
    const middlewares = this.config.get('middleware', [])
    for (const mid of middlewares) {
      // 用户中间件目录存在中间件
      const userMiddlewarePath = path.join(this.middlewarePath, mid)
      // 确认模块可加载
      if (require.resolve(userMiddlewarePath)) {
        const currentMiddleware = require(userMiddlewarePath)
        if (is.class(currentMiddleware)) {
          this.koaApplication.use((ctx, next) => {
            try {
              const injectedMiddleware = injectorFactory(currentMiddleware, ctx)
              return injectedMiddleware.handle(ctx, next)
            } catch (err) {
              this.koaApplication.emit('error', err, ctx)
            }
          })
        } else {
          this.koaApplication.use(currentMiddleware)
        }
      }
    }
  }

  /**
   * 注册模板引擎
   */
  registerTemplate() {
    const templateEnv = new nunjucks.Environment([new nunjucks.FileSystemLoader(this.viewsPath, {
      noCache: this.isDebug,
      watch: this.isDebug,
    }), new nunjucks.FileSystemLoader(path.resolve(__dirname, '../errors/views'), {
      noCache: this.isDebug,
      watch: this.isDebug,
    })], {
      autoescape: false
    })
    templateEnv.addGlobal('app', this)
    templateEnv.addGlobal('config', this.config)
    templateEnv.addGlobal('__public__', this.config.get('app.public_prefix', ''))
    this.singleton('template', templateEnv)
  }

  /**
   * Register Services
   */
  registerServices() {
    // register the application key
    this.registerSecretKey()
    // register application request time
    this.registerRequestTime()
    // register the exception handling mechanism
    this.registerErrorHandler()
    // register request.body
    this.registerRequestBody()
    // register Cors
    this.registerCors()
    // register static resource services
    this.registerStaticServer()
    // register session
    this.registerSession()
    // 注册 csrf 安全密钥
    this.registerCsrfSecret()
    // register Application context
    this.registerContext()
    // register global middleware
    this.registerGlobalMiddlewares()
    // register template engine
    this.registerTemplate()
  }

  /**
   * load all modules
   */
  loadModules() {
    // Load all the controllers of the root module
    this.loadModuleProperties(this.rootModule)
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  loadSubModules(ModuleInstance) {
    const modules = getModuleModules(this, ModuleInstance)
    for (const _module of modules) {
      if (!this.has(_module)) {
        this.bind(_module, _module)
      }
      // 加载当前子模块的所有控制器
      this.loadModuleProperties(this.get(_module))
    }
  }

  /**
   * Load the controller according to the module
   * 根据模块加载控制器
   * @param {object} ModuleInstance module instance
   */
  loadModuleProperties(ModuleInstance) {
    const controllers = getModuleControllers(this, ModuleInstance)
    const middlewares = getModuleMiddlewares(this, ModuleInstance)
    this.loadControllers(controllers, middlewares)
    this.loadSubModules(ModuleInstance)
  }

  /**
   * Load the controllers
   * 加载控制器
   */
  loadControllers(controllers, middlewares) {
    for (const _controller of controllers) {
      this.loadControllerMethods(_controller, middlewares)
    }
  }

  /**
   * paese middlewares
   * @param {array} middlewares
   */
  parseMiddlewares(middlewares = []) {
    return middlewares.map(middleware => {
      if (typeof middleware === 'string') {
        const middlewareRefer = require(path.resolve(this.middlewarePath, middleware))
        return this.getRouteMiddleware(middlewareRefer)
      } else if (typeof middleware === 'function') {
        return this.getRouteMiddleware(middleware)
      }
      return null
    }).filter(n => n)
  }

  /**
   * create middleware adapter
   * @param {*} middleware
   */
  getRouteMiddleware(middleware) {
    if (!middleware) return
    if (is.class(middleware)) {
      return (ctx, next) => {
        try {
          const injectedMiddleware = injectorFactory(middleware, ctx)
          return injectedMiddleware.handle(ctx, next)
        } catch (err) {
          this.koaApplication.emit('error', err, ctx)
        }
      }
    } else {
      return middleware
    }
  }

  /**
   * Load the controller method
   * 加载控制器方法
   * @param {object} controller controller instance
   */
  loadControllerMethods(Controller, moduleMiddlewares) {
    const isRoute = Controller.prototype[ISROUTE] || false
    const prefix = Controller.prototype[PREFIX] || ''
    const routes = Controller.prototype[ROUTES] || []
    const middlewares = Controller.prototype[MIDDLEWARES] || []

    if (isRoute === true) {
      const parsedControllerMiddlewares = this.parseMiddlewares(middlewares)
      const parsedModuleMiddlewares = this.parseMiddlewares(moduleMiddlewares)

      const combinedMidllewares = [...parsedModuleMiddlewares, ...parsedControllerMiddlewares]

      const router = new Router({
        prefix,
      })
      const methods = Object.keys(routes)
      for (const action of methods) {
        router[routes[action].method](routes[action].uri, ...combinedMidllewares, this.handleControllerMethod(Controller, action))
      }
      this.get('router').use(router.routes())
    }
  }

  /**
   * handle Controller s methods
   *
   * @param {object} controller controller instance
   * @param {string} action controller method name
   */
  handleControllerMethod(Controller, action) {
    const self = this
    return async function (ctx) {
      try {
        const injectorControllerInstance = injectorFactory(Controller, ctx)
        if (typeof injectorControllerInstance[action] === 'function') {
          const keys = self.sortMatchedRoute(ctx._matchedRoute)
          const args = keys.map(n => ctx.params[`${n.name}`])
          const code = injectorControllerInstance[action][HTTP_CODE] || null
          const controllerResult = await injectorControllerInstance[action](...args)
          return (new ResponseFactory(controllerResult, code)).output(ctx)
        }
      } catch (err) {
        self.koaApplication.emit('error', err, ctx)
      }
    }
  }

  /**
   * Sort routing parameter
   * 排序路由参数
   * @param {arr} _matchedRoute _matchedRoute
   */
  sortMatchedRoute(_matchedRoute) {
    const keys = []
    pathToRegexp(_matchedRoute, keys)
    return keys
  }

  /**
   * Load global variable
   * 加载全局变量
   */
  setGlobals() {
    const daze = new Daze()
    global.daze = global.DAZE = daze
  }

  /**
   * load koa application router module
   * 加载路由模块
   */
  loadRoutes() {
    this.koaApplication.use(this.get('router').routes())
    this.koaApplication.use((ctx, next) => {
      return next().then(() => {
        if (!ctx.status || ctx.status === 404) {
          this.koaApplication.emit('error', new HttpError(404, ctx.body || 'Not Found', []), ctx)
        }
      }).catch(err => {
        this.koaApplication.emit('error', err, ctx)
      })
    })
  }

  /**
   * Load the underlying container
   * 加载底层容器
   */
  loadContainer() {
    Container.setInstance(this)
    this.bind('app', this)
  }

  /**
   * 自动配置框架运行环境
   */
  loadEnv() {
    const nodeEnv = process.env.NODE_ENV
    const dazeEnv = process.env.DAZE_ENV
    if (!nodeEnv) {
      switch (dazeEnv) {
        case 'dev':
          process.env.NODE_ENV = 'development'
          break
        case 'test':
          process.env.NODE_ENV = 'test'
          break
        default:
          process.env.NODE_ENV = 'production'
          break
      }
    }
  }

  /**
   * 清理一次性 session
   */
  flushSession() {
    this.koaApplication.use(async (ctx, next) => {
      if (ctx.session[SESSION_FLASHED] === true && is.array(ctx.session[SESSION_FLASHS])) {
        for (const flash of ctx.session[SESSION_FLASHS]) {
          delete ctx.session[flash]
        }
        ctx.session[SESSION_FLASHS] = []
      }
      if (ctx.session[SESSION_FLASHED] === false) {
        ctx.session[SESSION_FLASHED] = true
      }
      await next()
    })
  }

  /**
   * Initialization application
   */
  initialize() {
    // 加载运行环境
    this.loadEnv()
    // 注册容器
    this.loadContainer()

    const clusterConfig = this.config.get('app.cluster')

    // 在集群模式下，主进程不运行业务代码
    if (!clusterConfig.enable || !cluster.isMaster) {
      // 注册全局变量
      // this.setGlobals()
      // 注册自定义服务
      this.loadProviders()
      // 注册 koa 服务
      this.registerServices()
      // // 注册控制器模块
      this.loadModules()
      // 清理一次性session
      this.flushSession()
      // 注册路由
      this.loadRoutes()
    }
  }

  /**
   * Start the application
   */
  run() {
    // Initialization application
    this.initialize()
    // check app.cluster.enabled
    if (this.config.get('app.cluster.enabled')) {
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        this.clusterMaterInstance.run()
      } else {
        this.clusterWorkerInstance.run()
      }
      this.make('messenger')
    } else {
      // 以单线程工作方式运行应用
      this.startServer(this.port)
    }
    return this
  }

  /**
   * Start the HTTP service
   */
  startServer(...args) {
    return this.koaApplication.listen(...args)
  }

  /**
   * Gets the binding dependency from the container
   * @param {mixed} abstract Dependent identification
   * @param {array} args Depends on instantiated parameters
   */
  get(abstract, args = [], force = false) {
    return this.make(abstract, args, force)
  }

  /**
   * Bind dependencies to the container
   * @param {mixed} abstract Dependent identification
   * @param {mixed} concrete Dependent
   * @param {*} shared singleton or multiton
   */
  bind(abstract, concrete = null, shared = true) {
    return shared ? this.singleton(abstract, concrete) : this.multiton(abstract, concrete)
  }

  /**
   * Check that the dependency id is bound to the container
   * @param {mixed} abstract Dependent identification
   */
  has(abstract) {
    return this.bound(abstract)
  }

  /**
   * bind and get file path
   * @param {string} abstractFilePath file path
   */
  craft(abstract, shared = true) {
    if (typeof abstract === 'string') {
      if (require.resolve(abstract)) {
        const Res = require(abstract)
        if (!this.has(Res)) {
          this.bind(Res, Res, shared)
        }
        return this.get(Res)
      }
    } else {
      if (!this.has(abstract)) {
        this.bind(abstract, abstract, shared)
      }
      return this.get(abstract)
    }
  }
}

module.exports = Application
