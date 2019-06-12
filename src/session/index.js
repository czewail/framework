const Container = require('../container');
const { decode, encode } = require('./helpers');

const defualtOpts = {
  key: 'dazejs:sess',
  overwrite: true,
  httpOnly: true,
  signed: false,
  autoCommit: true,
};

const ONE_DAY = 86400000;

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
    const cookie = this.request.cookieValue(this.options.key, this.options);
    console.log(cookie, 11111);
    if (!cookie) {
      this.dispose();
      return;
    }
    let json = {};
    try {
      json = decode(cookie);
    } catch (err) {
      this.dispose();
      return;
    }
    console.log(json, 222222);
    this.dispose(json);
  }

  get(key) {
    // console.log(this.session, 1111111);
    if (!this.store) this.initFromCookie();
    // console.log(this.session, 22222222);
    if (!key) return this.session;
    // console.log(this.session, 3333333);
    return this.session[key];
  }

  set(key, value) {
    // console.log(key, value);
    if (!this.session) this.session = {};
    this.session[key] = value;
  }

  dispose(data = {}) {
    if (!this.session) this.session = {};
    const maxAge = this.options.maxAge ? this.options.maxAge : ONE_DAY;
    this.session._expire = maxAge + Date.now();
    this.session._maxAge = maxAge;
    this.session = {
      ...this.session,
      ...data,
    };
    console.log(this.session);
    return this.session;
  }

  // resolve() {
  //   return async (request, next) => {
  //     const response = await next();
  //     await request.session().commit(response);
  //     return response;
  //   };
  // }

  async commit(response) {
    console.log(this.session);
    // console.log(this.session, 11111, 222);
    const encodedSession = encode(this.session);
    // console.log(this.options.key, encodedSession, this.options);
    // return response.cookie(this.options.key, encodedSession, this.options);
  }
}

module.exports = Session;
