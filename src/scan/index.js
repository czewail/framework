const path = require('path');
const glob = require('glob');
const Container = require('../container');

class Scan {
  constructor() {
    this.app = Container.get('app');
  }

  resolve() {
    const files = this.scanFiles();
    this.sortingFiles(files);
  }

  sortingFiles(files = []) {
    for (const file of files) {
      // eslint-disable-next-line
      const currentFile = require(file)
      if (currentFile && currentFile.prototype) {
        const type = Reflect.getMetadata('type', currentFile.prototype);
        switch (type) {
          case 'controller':
            this.registerController(currentFile);
            break;
          case 'middleware':
            this.registerMiddleware(currentFile);
            break;
          case 'service':
          case 'resource':
          case 'component':
            this.registerComponent(currentFile);
            break;
          default:
            break;
        }
      }
    }
    return this;
  }

  scanFiles() {
    return glob.sync(path.resolve(this.app.appPath, '**'), {
      nodir: true,
    });
  }

  registerMiddleware(middleware) {
    console.log(middleware);
  }

  registerController(controller) {
    this.app.get('controller').register(controller);
  }

  registerComponent(component) {
    this.app.get('component').register(component);
  }
}

module.exports = Scan;
