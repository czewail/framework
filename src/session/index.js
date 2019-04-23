const Container = require('../container');

const defualtOpts = {
  key: 'dazejs:sess',
  overwrite: true,
  httpOnly: true,
  signed: false,
  autoCommit: true,
};

class Session {
  constructor(options = {}) {
    this.app = Container.get('app');
    this.options = {
      ...defualtOpts,
      ...this.app.get('config').get('session', {}),
      ...options,
    };
  }

  get() {}

  set() {}
}

module.exports = Session;
