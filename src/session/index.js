const Container = require('../container');
const { decode, encode } = require('./helpers');
const symbols = require('../symbol');

const defualtOpts = {
  key: 'dazejs:sess',
  // overwrite: true,
  httpOnly: true,
  signed: false,
  autoCommit: true,
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
    const cookie = this.request.cookies.get(this.options.key, this.options);
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
    this.session = data;
    this.session._expire = maxAge + Date.now();
    this.session._maxAge = maxAge;
    return this.session;
  }

  /**
   * get session value
   * @param {String} key session key
   */
  get(key, defaulVal) {
    if (!key) return this.session;
    return this.session[key] || defaulVal;
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
   * push session value in array session
   * @param {string} key
   * @param {mixed} value
   */
  push(key, value) {
    const arr = this.get(key, []);
    arr.push(value);
    this.set(key, arr);
    return this;
  }

  /**
   * set a flash session
   * @param {String} key session key
   * @param {Mixed} value  session value
   */
  flash(key, value) {
    this.set(key, value);
    this.push(symbols.SESSION.NEW_FLASHS, key);
    this.updateOldFlashSession(key);
  }

  /**
   * age flash session value
   */
  ageFlashSession() {
    const oldFlashs = this.get(symbols.SESSION.OLD_FLASHS, []);
    for (const old of oldFlashs) {
      this.remove(old);
    }
    this.set(symbols.SESSION.OLD_FLASHS, this.get(symbols.SESSION.NEW_FLASHS, []));
    this.set(symbols.SESSION.NEW_FLASHS, []);
  }

  /**
   * update old flash session
   * @param  {...string} keys session keys
   */
  updateOldFlashSession(...keys) {
    const oldFlashs = this.get(symbols.SESSION.OLD_FLASHS, []);
    const _keys = oldFlashs.filter(key => !keys.includes(key));
    this.set(symbols.SESSION.OLD_FLASHS, _keys);
    return this;
  }

  async commit() {
    this.ageFlashSession();
    const encodedSession = encode(this.session);
    this.request.cookies.set(this.options.key, encodedSession, this.options);
  }

  async autoCommit() {
    if (this.options.autoCommit === true) {
      await this.commit();
    }
  }
}

module.exports = Session;
