const is = require('core-util-is');
const Container = require('../container');
const { decode, encode } = require('./helpers');
const symbols = require('../symbol');

const defualtOpts = {
  key: 'dazejs:sess',
  // overwrite: true,
  httpOnly: true,
  signed: false,
  // autoCommit: true,
};

const ONE_DAY = 86400000;

class Session {
  constructor(request, options = {}) {
    /**
     * @var {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Request} request Request instance
     */
    this.request = request;

    /**
     * @var {Object} options
     */
    this.options = Object.assign(defualtOpts, this.app.get('config').get('session', {}), options);

    /**
     * @var {Object | Null} store the other store
     */
    this.store = null;

    /**
     * @var {Object | Null} session session Object
     */
    this.session = null;

    /**
     * recover session from store
     */
    this.recoverSession();
  }

  /**
   * recover session from store
   * default from cookie
   */
  recoverSession() {
    if (!this.store) this.recoverFromCookieStore();
  }

  /**
   * recover session from cookie store
   */
  recoverFromCookieStore() {
    const cookie = this.request.cookieValue(this.options.key, this.options);
    if (!cookie) {
      this.generate();
      return;
    }
    let json = {};
    try {
      json = decode(cookie);
    } catch (err) {
      this.generate();
      return;
    }
    this.generate(json);
  }

  /**
   * generate session
   * @param {Object} data session data
   */
  generate(data = {}) {
    if (!this.session) this.session = {};
    const maxAge = this.options.maxAge ? this.options.maxAge : ONE_DAY;
    this.session._expire = maxAge + Date.now();
    this.session._maxAge = maxAge;
    this.session = data;
    return this.session;
  }

  /**
   * get session value
   * @param {String} key session key
   */
  get(key) {
    if (!key) return this.session;
    return this.session[key];
  }

  /**
   * set a session
   * @param {String} key session key
   * @param {Mixed} value session value
   */
  set(key, value) {
    if (!this.session) this.session = {};
    this.session[key] = value;
    return this;
  }

  /**
   * remove a session
   * @param {*} key session key
   */
  remove(key) {
    if (!this.session) this.session = {};
    delete this.session[key];
    return this;
  }

  /**
   * set a flash session
   * @param {String} key session key
   * @param {Mixed} value  session value
   */
  flash(name, value) {
    if (!name) return this;
    if (!this.session) this.session = {};
    if (!this.session[symbols.SESSION.FLASHS]) this.session[symbols.SESSION.FLASHS] = [];

    if (is.isObject(name)) {
      Object.keys(name).forEach((key) => {
        this.session[key] = name[key];
        this.session[symbols.SESSION.FLASHS].push(key);
      });
    } else {
      if (!value) return this;
      this.session[name] = value;
      this.session[symbols.SESSION.FLASHS].push(name);
    }
    this.session[symbols.SESSION.FLASHED] = false;
    return this;
  }

  async commit(response) {
    const encodedSession = encode(this.session);
    return response.cookie(this.options.key, encodedSession, this.options);
  }
}

module.exports = Session;
