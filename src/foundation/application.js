/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path');
const cluster = require('cluster');
const util = require('util');
const Keygrip = require('keygrip');
const is = require('core-util-is');
const Container = require('../container');
const { Master, Worker } = require('../cluster');
const providers = require('./providers');
const HttpError = require('../errors/http-error');

const DEFAULT_PORT = 8080;

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
  VERSION = '1.0.0';

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
   * provider runtime calls
   *
   * @var {array}
   */
  runtimeCalls = [];

  /**
   * Create a Dazejs Application insstance
   *
   * @param {string} rootPath application root path
   * @param {object} paths application usage paths
   * @returns {void}
   */
  constructor(rootPath, paths = {}) {
    super();
    if (!rootPath) throw new Error('must pass the runPath parameter when you apply the instantiation!');

    this.rootPath = rootPath;

    this.setPaths(paths);

    this.initialContainer();
  }

  /**
   *  Set the paths for the application.
   * @param {object} paths paths
   * @returns {Application} this
   * @private
   */
  setPaths(paths) {
    /** app workspace path */
    this.appPath = path.resolve(this.rootPath, paths.app || 'app');
    /** config file path */
    this.configPath = path.resolve(this.rootPath, paths.config || 'config');
    /** views file path */
    this.viewPath = path.resolve(this.rootPath, paths.view || '../views');
    /** public file path */
    this.publicPath = path.resolve(this.rootPath, paths.public || '../public');
    /** log file path */
    this.logPath = path.resolve(this.rootPath, paths.log || '../logs');
    /** provider file path */
    this.providerPath = path.resolve(this.rootPath, paths.provider || 'provider');

    return this;
  }

  setProperties() {
    this.config = this.get('config');
    this.port = this.config.get('app.port', DEFAULT_PORT);
    this.isDebug = this.config.get('app.debug', false);

    return this;
  }

  /**
   * register base provider
   * @private
   */
  async registerBaseProviders() {
    await this.register(new providers.Config(this));
    await this.register(new providers.Loader(this));
    await this.register(new providers.Messenger(this));
  }

  /**
   * register default provider
   * @private
   */
  async registerDefaultProviders() {
    await this.register(new providers.App(this));
    await this.register(new providers.Controller(this));
    // await this.register(new providers.Component(this));
    await this.register(new providers.Middleware(this));
    await this.register(new providers.Router(this));
    await this.register(new providers.Template(this));
  }

  /**
   * register vendor providers
   * @private
   */
  async registerVendorProviders() {
    const _providers = this.config.get('app.providers', []);
    const providerPromises = [];
    for (const key of _providers) {
      providerPromises.push(this.load(key));
    }
    await Promise.all(providerPromises);
  }


  /**
   * load a registed provider with key or provider function
   * @param {String | Class} Provider
   */
  async load(Provider) {
    if (is.isString(Provider)) {
      if (this.has(Provider)) {
        await this.register(this.get(Provider));
        return this;
      }
      try {
        const modulePath = require.resolve(Provider);
        // eslint-disable-next-line
        const Target = require(modulePath);
        await this.register(new Target(this));
      } catch (err) {
        throw new Error(`Can not find provider [${Provider}]!`);
      }
      return this;
    }
    if (is.isFunction(Provider)) {
      const type = Reflect.getMetadata('type', Provider.prototype);
      if (type !== 'provider') throw new Error(`${Provider.name || 'Unknow'} is not a provider!`);
      await this.register(new Provider(this));
      return this;
    }
    throw new Error(`Does not supported ${typeof Provider} Provider!`);
  }

  /**
   * register provider in App
   * @param {class} Provider Provider
   */
  async register(Provider) {
    if (Reflect.has(Provider, 'register') && typeof Provider.register === 'function') {
      await Provider.register(this);
    }

    if (Reflect.has(Provider, 'launch') && typeof Provider.launch === 'function') {
      this.launchCalls.push((...args) => Provider.launch(...args));
    }
  }

  async fireLaunchCalls(...args) {
    const results = [];
    for (const launch of this.launchCalls) {
      results.push(launch(...args, this));
    }
    await Promise.all(results);
  }

  /**
   * initial Container
   *
   * @returns {void}
   */
  initialContainer() {
    Container.setInstance(this);
    this.bind('app', this);
  }

  /**
   * getter for Configuration cluster.enabled
   */
  get isCluster() {
    return this.config.get('app.cluster.enable');
  }

  // 获取集群主进程实例
  get clusterMaterInstance() {
    const clusterConfig = this.config.get('app.cluster');
    return new Master({
      port: this.port,
      workers: clusterConfig.workers || 0,
      sticky: clusterConfig.sticky || false,
    });
  }


  // 获取集群工作进程实例
  get clusterWorkerInstance() {
    const clusterConfig = this.config.get('app.cluster');
    return new Worker({
      port: this.port,
      sticky: clusterConfig.sticky || false,
      createServer: (...args) => this.startServer(...args),
    });
  }

  /**
   * 自动配置框架运行环境
   */
  loadEnv() {
    const nodeEnv = process.env.NODE_ENV;
    const dazeEnv = process.env.DAZE_ENV;
    if (!nodeEnv) {
      switch (dazeEnv) {
        case 'dev':
          process.env.NODE_ENV = 'development';
          break;
        case 'test':
          process.env.NODE_ENV = 'test';
          break;
        default:
          process.env.NODE_ENV = 'production';
          break;
      }
    }
    return this;
  }

  loadListeners() {
    if (!this.listenerCount('error')) {
      this.on('error', this.onerror);
    }
  }

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));
    if (err instanceof HttpError) return;
    // eslint-disable-next-line
    console.error();
    // eslint-disable-next-line
    console.error(err.stack || err.toString());
    // eslint-disable-next-line
    console.error();
  }

  registerKeys() {
    const keys = this.config.get('app.keys', ['DAZE_KEY_1']);
    const algorithm = this.config.get('app.algorithm', 'sha1');
    const encoding = this.config.get('app.encoding', 'base64');
    this.keys = new Keygrip(keys, algorithm, encoding);
  }

  /**
   * Initialization application
   */
  async initialize() {
    // 加载运行环境
    this.loadEnv();

    this.loadListeners();

    await this.registerBaseProviders();

    this.setProperties();

    this.registerKeys();

    const clusterConfig = this.config.get('app.cluster');
    // 在集群模式下，主进程不运行业务代码
    if (!clusterConfig.enable || !cluster.isMaster) {
      await this.registerDefaultProviders();
      await this.registerVendorProviders();
      await this.registerHttpServerProvider();
      await this.fireLaunchCalls();
    }
  }

  async registerHttpServerProvider() {
    await this.register(new providers.HttpServer(this));
  }

  /**
   * Start the application
   */
  async run() {
    // Initialization application
    await this.initialize();
    // check app.cluster.enabled
    if (this.config.get('app.cluster.enable')) {
      // 以集群工作方式运行应用
      if (cluster.isMaster) {
        this._server = this.clusterMaterInstance.run();
      } else {
        this._server = this.clusterWorkerInstance.run();
      }
    } else {
      // 以单线程工作方式运行应用
      this._server = this.startServer(this.port);
    }
    return this._server;
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this._server) return reject(new Error('app does not running!'));
      return this._server.close((error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  /**
   * Start the HTTP service
   */
  startServer(...args) {
    return this.listen(...args);
  }

  listen(...args) {
    const server = this.get('httpServer');
    return server.listen(...args);
  }


  call(abstract, args = []) {
    const concrete = this.make(abstract);
    if (typeof concrete !== 'function') return undefined;
    return concrete(...args);
  }

  /**
   * Gets the binding dependency from the container
   * @param {string} tag tag name
   */
  tagged(tag) {
    if (!this.tags[tag]) return [];
    return this.tags[tag];
    // if (!shouldMake) return this.tags[tag];
    // return this.tags[tag].map(t => this.make(t, args));
  }

  /**
   * set abstract in groups
   * @param {string} abstract Object identifier
   * @param {string} tag tag name
   */
  tag(abstract, tag) {
    if (!abstract || !tag) return undefined;
    if (!this.tags[tag]) this.tags[tag] = [];
    this.tags[tag].push(abstract);
    return this;
  }

  /**
   * Gets the binding dependency from the container
   * @typedef {import('../config')} Config
   * @type {('config', args: any[] = [], force = false) => Config}
   * @param {any} abstract Dependent identification
   * @param {any[]} [args=[]] Depends on instantiated parameters
   * @param {boolean} [force=false] forced instantiation
   */
  get(abstract, args = [], force = false) {
    return this.make(abstract, args, force);
  }

  /**
   * Bind dependencies to the container
   * @param {*} abstract Dependent identification
   * @param {*} concrete Dependent
   * @param {*} shared singleton or multiton
   * @param {Boolean} [callable=false] Generic Functions
   */
  bind(abstract, concrete = null, shared = true, callable = false) {
    return shared
      ? this.singleton(abstract, concrete, callable)
      : this.multiton(abstract, concrete, callable);
  }

  /**
   * Check that the dependency id is bound to the container
   * @param {*} abstract Dependent identification
   */
  has(abstract) {
    return this.bound(abstract);
  }

  /**
   * bind and get file path
   * @param {*} abstract Dependent identification
   * @param {*} [shared=true] singleton or multiton
   */
  craft(abstract, shared = true) {
    if (typeof abstract === 'string') {
      if (require.resolve(abstract)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Res = require(abstract);
        if (!this.has(Res)) {
          this.bind(Res, Res, shared);
        }
        return this.get(Res);
      }
    } else {
      if (!this.has(abstract)) {
        this.bind(abstract, abstract, shared);
      }
      return this.get(abstract);
    }
    return undefined;
  }
}


module.exports = Application;
