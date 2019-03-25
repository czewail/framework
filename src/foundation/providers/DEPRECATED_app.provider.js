const path = require('path');
const Router = require('koa-router');
const pathToRegexp = require('path-to-regexp');
const isClass = require('node-is-class');
const { getModuleControllers, getModuleModules, getModuleMiddlewares } = require('../helpers');
const symbols = require('../../symbol');
// const injectorFactory = require('../injector/factory');
const ResponseFactory = require('../../response/manager');
const HttpError = require('../../errors/http-error');

class AppProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * @var {string} root app root module filename
   */
  root = 'app.module.js';

  constructor(app) {
    this.app = app;
  }

  /**
   * app root module instance
   */
  get appModule() {
    const applicationModulePath = path.resolve(this.app.appPath, this.root);
    if (require.resolve(applicationModulePath)) {
      const AppModule = require(applicationModulePath);
      return new AppModule();
    }
    return null;
  }

  /**
   * Provider register Hook
   */
  register() {
    this.loadModuleProperties(this.appModule);
  }

  /**
   * Provider launch Hook
   */
  launch() {
    this.loadRoutes();
  }

  /**
   * load koa application router module
   */
  loadRoutes() {
    this.app.use(this.app.get('router').routes());
    this.app.use((ctx, next) => next().then(() => {
      if (!ctx.status || ctx.status === 404) {
        this.app.get('koa').emit('error', new HttpError(404, ctx.body || 'Not Found', []), ctx);
      }
    }).catch((err) => {
      this.app.get('koa').emit('error', err, ctx);
    }));
  }

  /**
   * Load the controller according to the module
   * @param {object} ModuleInstance module instance
   */
  loadModuleProperties(ModuleInstance) {
    const controllers = getModuleControllers(this.app, ModuleInstance);
    const middlewares = getModuleMiddlewares(this.app, ModuleInstance);
    this.loadControllers(controllers, middlewares);
    this.loadSubModules(ModuleInstance);
  }

  /**
   * Load all sub-modules
   * @param {object} ModuleInstance
   */
  loadSubModules(ModuleInstance) {
    const modules = getModuleModules(this.app, ModuleInstance);
    for (const _module of modules) {
      this.loadModuleProperties(_module);
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
      this.loadControllerMethods(_controller, middlewares);
    }
  }

  /**
   * paese middlewares
   * @param {array} middlewares
   */
  parseMiddlewares(middlewares = []) {
    return middlewares.map((middleware) => {
      if (typeof middleware === 'string') {
        const middlewareRefer = require(path.resolve(this.app.middlewarePath, middleware));
        return this.getRouteMiddleware(middlewareRefer);
      } if (typeof middleware === 'function') {
        return this.getRouteMiddleware(middleware);
      }
      return null;
    }).filter(n => n);
  }

  /**
   * create middleware adapter
   * @param {*} middleware
   */
  getRouteMiddleware(middleware) {
    if (!middleware) return;
    if (isClass(middleware)) {
      return (ctx, next) => {
        try {
          const injectedMiddleware = injectorFactory(middleware, ctx);
          return injectedMiddleware.handle(ctx, next);
        } catch (err) {
          this.app.get('koa').emit('error', err, ctx);
        }
      };
    }
    return middleware;
  }

  /**
   * Load the controller method
   * @param {object} controller controller instance
   */
  loadControllerMethods(Controller, moduleMiddlewares) {
    const isRoute = Controller.prototype[symbols.ISROUTE] || false;
    const prefix = Controller.prototype[symbols.PREFIX] || '';
    const routes = Controller.prototype[symbols.ROUTES] || [];
    const middlewares = Controller.prototype[symbols.MIDDLEWARES] || [];

    if (isRoute === true) {
      const parsedControllerMiddlewares = this.parseMiddlewares(middlewares);
      const parsedModuleMiddlewares = this.parseMiddlewares(moduleMiddlewares);

      const combinedMidllewares = [...parsedModuleMiddlewares, ...parsedControllerMiddlewares];

      const router = new Router({
        prefix,
      });
      const methods = Object.keys(routes);
      for (const action of methods) {
        router[routes[action].method](routes[action].uri, ...combinedMidllewares, this.handleControllerMethod(Controller, action));
      }
      this.app.get('router').use(router.routes());
    }
  }

  /**
   * handle Controller s methods
   *
   * @param {object} controller controller instance
   * @param {string} action controller method name
   */
  handleControllerMethod(Controller, action) {
    const self = this;
    return async function (ctx) {
      try {
        const injectorControllerInstance = injectorFactory(Controller, ctx);
        if (typeof injectorControllerInstance[action] === 'function') {
          const keys = self.sortMatchedRoute(ctx._matchedRoute);
          const args = keys.map(n => ctx.params[`${n.name}`]);
          const code = injectorControllerInstance[action][symbols.HTTP_CODE] || null;
          const controllerResult = await injectorControllerInstance[action](...args);
          return (new ResponseFactory(controllerResult, code)).output(ctx);
        }
      } catch (err) {
        self.app.get('koa').emit('error', err, ctx);
      }
    };
  }

  /**
   * Sort routing parameter
   * @param {arr} _matchedRoute _matchedRoute
   */
  sortMatchedRoute(_matchedRoute) {
    const keys = [];
    pathToRegexp(_matchedRoute, keys);
    return keys;
  }
}

module.exports = AppProvider;
