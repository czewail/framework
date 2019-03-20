/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path')
const cluster = require('cluster')
const Container = require('../container')
const { Master, Worker } = require('../cluster')
const providers = require('./providers')
const Middleware = require('../middleware')

const DEFAULT_PORT = 8000

class Application extends Container {
  /**
   * The base path for the Application installation.
   *
   * @var {string}
   */
  rootPath = '';

  /**
   * The Dazejs Framework Version
   *
   * @var {string}
   */
  VERSION = '0.8.1';

  /**
   * The config instance
   *
   * @var {object}
   */
  config = null;

  /**
   * application run port
   *
   * @var {number}
   */
  port = 0;

  /**
   * debug enabled?
   *
   * @var {boolean}
   */
  isDebug = false;

  /**
   * provider launch calls
   *
   * @var {array}
   */
  launchCalls = [];

  /**
   * Create a Dazejs Application insstance
   *
   * @param {string} rootPath application root path
   * @param {object} paths application usage paths
   * @returns {void]}
   */
  constructor(rootPath, paths = {}) {
    super()
    if (!rootPath) throw new Error('must pass the runPath parameter when you apply the instantiation!')

    this.rootPath = rootPath

    this.setPaths(paths)

    this.initialContainer()

    this.registerBaseProviders()

    this.setProperties()
  }

  /**
   *  Set the paths for the application.
   * @param {object} paths paths
   * @returns {Application} this
   * @private
   */
  setPaths(paths) {
    /** app workspace path */
    this.appPath = path.resolve(this.rootPath, paths.app || 'app')
    /** config file path */
    this.configPath = path.resolve(this.rootPath, paths.config || 'config')
    /** views file path */
    this.viewPath = path.resolve(this.rootPath, paths.view || '../views')
    /** public file path */
    this.publicPath = path.resolve(this.rootPath, paths.public || '../public')
    /** log file path */
    this.logPath = path.resolve(this.rootPath, paths.log || '../logs')
    /** controller file path */
    this.controllerPath = path.resolve(this.rootPath, this.appPath, paths.controller || 'controller')
    /** middleware file path */
    this.middlewarePath = path.resolve(this.rootPath, this.appPath, paths.middleware || 'middleware')
    /** service file path */
    this.servicePath = path.resolve(this.rootPath, this.appPath, paths.service || 'service')
    /** validate file path */
    this.validatePath = path.resolve(this.rootPath, this.appPath, paths.validate || 'validate')
    /** transformer file path */
    this.transformerPath = path.resolve(this.rootPath, this.appPath, paths.validate || 'transformer')

    return this
  }

  setProperties() {
    this.config = this.get('config')
    this.port = this.config.get('app.port', DEFAULT_PORT)
    this.isDebug = this.config.get('app.debug', false)

    return this
  }

  /**
   * register base provider
   * @private
   */
  registerBaseProviders() {
    this.register(new providers.Config(this))

    this.register(new providers.Messenger(this))
  }

  /**
   * register default provider
   * @private
   */
  registerDefaultProviders() {
    this.register(new providers.Request(this))

    // this.register(new providers.Response(this))

    // this.register(new providers.View(this))

    // this.register(new providers.Session(this))

    // this.register(new providers.Cookie(this))

    // this.register(new providers.Logger(this))

    // this.register(new providers.KoaServices(this))

    // this.register(new providers.Template(this))

    // this.register(new providers.Middleware(this))
  }

  /**
   * register app provider
   * @private
   */
  registerAppProvider() {
    this.register(new providers.App(this))
  }

  /**
   * register provider in App
   * @param {class} Provider Provider
   */
  register(Provider) {
    if (Reflect.has(Provider, 'register') && typeof Provider.register === 'function') {
      Provider.register(this)
    }

    if (Reflect.has(Provider, 'launch') && typeof Provider.launch === 'function') {
      this.launchCalls.push((...args) => {
        return Provider.launch(...args)
      })
    }
  }

  fireLaunchCalls(...args) {
    for (const launch of this.launchCalls) {
      launch(...args, this)
    }
  }

  /**
   * initial Container
   *
   * @returns {void}
   */
  initialContainer() {
    Container.setInstance(this)
    this.bind('app', this)
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster.enable')
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

  use(...params) {
    this.get('koa').use(...params)
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
   * Initialization application
   */
  initialize() {
    // 加载运行环境
    this.loadEnv()

    const clusterConfig = this.config.get('app.cluster')

    // 在集群模式下，主进程不运行业务代码
    if (!clusterConfig.enable || !cluster.isMaster) {
      this.registerDefaultProviders()

      this.register(new providers.Module(this))
      this.register(new providers.Router(this))
      this.register(new providers.Middleware(this))

      // this.registerAppProvider()
      this.registerHttpServerProvider()

      this.fireLaunchCalls()
    }
  }

  registerHttpServerProvider() {
    this.register(new providers.HttpServer(this))
  }

  /**
   * Start the application
   */
  run() {
    // Initialization application
    this.initialize()
    // check app.cluster.enabled
    if (this.config.get('app.cluster.enable')) {
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        this.clusterMaterInstance.run()
      } else {
        this.clusterWorkerInstance.run()
      }
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
    return this.listen(...args)
  }

  listen(...args) {
    const server = this.get('httpServer')
    // server.use((req, res, next) => {
    //   this.fireLaunchCalls(req, res)
    //   next()
    // })
    // server.use((req, res) => {
    //   res.end('1111')
    // })
    return server.listen(...args)
  }

  /**
   * Gets the binding dependency from the container
   * @param {string} group group name
   * @param {array} args Depends on instantiated parameters
   */
  tagged(tag, shouldMake = false) {
    if (!this.tags[tag]) return []
    if (!shouldMake) return this.tags[tag]
    return this.tags[tag].map(t => this.make(t))
  }

  /**
   * set abstract in groups
   * @param {string} abstract Object identifier
   * @param {string} group group name
   */
  tag(abstract, tag) {
    if (!abstract || !tag) return
    if (!this.tags[tag]) this.tags[tag] = []
    this.tags[tag].push(abstract)
    return this
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
