const Scan = require('../../scan');

class AppProvider {
  constructor(app) {
    this.app = app;
  }

  register() {
    this.app.bind('scan', Scan);
  }

  launch() {
    const scan = this.app.get('scan');
    scan.resolve();
  }
}


module.exports = AppProvider;
