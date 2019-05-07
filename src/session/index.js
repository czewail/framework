const Container = require('../container');
const { decode } = require('./helpers');

const defualtOpts = {
  key: 'dazejs:sess',
  overwrite: true,
  httpOnly: true,
  signed: false,
  autoCommit: true,
};

class Session {
  constructor(request, options = {}) {
    this.app = Container.get('app');
    this.request = request;
    this.options = {
      ...defualtOpts,
      ...this.app.get('config').get('session', {}),
      ...options,
    };
    this.store = null;
    this.session = {};
  }

  initFromCookie() {
    const cookie = this.request.getCookie(this.options.key, this.options);
    if (!cookie) {
      this.session = {};
    }
    let json = {};
    try {
      json = decode(cookie);
    } catch (err) {
      this.session = {};
      return undefined;
    }
    this.session = json;
    return undefined;
  }

  get(key) {
    if (this.session) return this.session;
    if (!this.store) this.initFromCookie();
    if (!key) return this.session;
    return this.session[key];
  }

  set(key, value) {
    if (!this.session) this.session = {};
    this.session[key] = value;
  }
}

module.exports = Session;
