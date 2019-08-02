const AutoScan = require('../../auto-scan');

class AppProvider {
  constructor(app) {
    this.app = app;
  }

  register() {
    this.app.bind('scan', AutoScan);
  }

  launch() {
    const scan = this.app.get('scan');
    scan.resolve();
  }
}


module.exports = AppProvider;
