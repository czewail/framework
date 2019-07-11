const path = require('path');
const glob = require('glob');
const Container = require('../container');

class Scan {
  constructor() {
    this.app = Container.get('app');
  }

  resolve() {
    this.resolveAppFiles(this.scanAppDir());
    this.resolveProviderFiles(this.scanProviderDir());
  }

  resolveAppFiles(files = []) {
    for (const file of files) {
      // eslint-disable-next-line
      const target = require(file)
      if (target && target.prototype) {
        const type = Reflect.getMetadata('type', target.prototype);
        switch (type) {
          case 'controller':
            this.registerController(target, file);
            break;
          case 'middleware':
            this.registerMiddleware(target, file);
            break;
          case 'service':
          case 'resource':
          case 'validator':
          case 'component':
            this.registerComponent(target, file);
            break;
          default:
            break;
        }
      }
    }
    return this;
  }

  resolveProviderFiles(files = []) {
    for (const file of files) {
      // eslint-disable-next-line
      const target = require(file)
      if (typeof target === 'function') {
        this.registerProvider(target, file);
      }
    }
    return this;
  }

  scanProviderDir() {
    return glob.sync(path.resolve(this.app.rootPath, 'provider', '**'), {
      nodir: true,
    });
  }

  scanAppDir() {
    return glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });
  }

  registerMiddleware(middleware, file) {
    const type = Reflect.getMetadata('middleware', middleware.prototype);
    this.app.bind(`middleware.${type || file}`, middleware);
  }

  registerController(controller, file) {
    this.app.get('controller').register(controller, file);
  }

  registerComponent(component, file) {
    this.app.get('component').register(component, file);
  }

  registerProvider(Provider) {
    this.app.register(new Provider(this.app));
  }
}

module.exports = Scan;
