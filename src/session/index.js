const Container = require('../container');
const { decode, encode } = require('./helpers');

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
    this.session = null;
  }

  initFromCookie() {
    const cookie = this.request.getCookie(this.options.key, this.options);
    if (!cookie) {
      this.session = {};
    }
    let json = {};
    try {
      json = decode(cookie);
      console.log(cookie, json);
    } catch (err) {
      this.session = {};
      return undefined;
    }
    this.session = json || {};
    return undefined;
  }

  get(key) {
    // console.log(this.session, 1111111);
    if (this.session) return this.session;
    if (!this.store) this.initFromCookie();
    // console.log(this.session, 22222222);
    if (!key) return this.session;
    // console.log(this.session, 3333333);
    return this.session[key];
  }

  set(key, value) {
    if (!this.session) this.session = {};
    this.session[key] = value;
  }

  async commit() {
    // console.log(this.session, 11111, 222);
    const encodedSession = encode(this.session);
    this.request.cookies.set(this.options.key, encodedSession, this.options);
  }
}

module.exports = Session;
