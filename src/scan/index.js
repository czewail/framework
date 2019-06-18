const path = require('path');
const glob = require('glob');
const Container = require('../container');

class Scan {
  constructor() {
    this.app = Container.get('app');
  }

  resolve() {
    const files = this.sanAppDir();
    this.sortingFiles(files);
  }

  sortingFiles(files = []) {
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
          case 'validate':
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

  sanAppDir() {
    return glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });
  }

  registerMiddleware(middleware, file) {
    console.log(middleware, file);
  }

  registerController(controller, file) {
    this.app.get('controller').register(controller, file);
  }

  registerComponent(component, file) {
    this.app.get('component').register(component, file);
  }
}

module.exports = Scan;
