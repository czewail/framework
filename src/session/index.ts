
import uuid from 'uuid/v4'
import is from 'core-util-is'
import { Container } from '../container'
import { decode, encode } from './helpers'
import * as symbols from '../symbol'

const defaultOpts = {
  store: 'cookie',
  key: 'dazejs:sess',
  httpOnly: true,
  signed: false,
  autoCommit: true,
};

const ONE_DAY = 86400000;
const EXTRA_STROES = new Set([
  'redis',
]);

export class Session {
  app: any;
  request: any;
  options: any;
  store: any;
  session: any;
  id: any;
  /**
   * Create Session instance
   * @param request
   * @param options
   */
  constructor(request: any, options: any = {}) {
    /**
     * @type app Application instance
     */
    this.app = Container.get('app');

    /**
     * @type request Request instance
     */
    this.request = request;

    /**
     * @type options
     */
    this.options = Object.assign(defaultOpts, this.app.get('config').get('session', {}), options);

    /**
     * @type store the other store
     */
    this.store = null;

    /**
     * @type session session Object
     */
    this.session = {};

    /**
     * @type  sessionID session id
     */
    this.id = '';

    // initialize Store
    this.initializeStore();
  }

  /**
   * initialize Store
   */
  initializeStore() {
    if (!this.options.store || this.options.store === 'cookie' || !EXTRA_STROES.has(this.options.store)) return;
    // eslint-disable-next-line
    const Store =  require(`./stores/${this.options.store.toLowerCase()}`);
    this.store = new Store(this.app);
  }

  /**
   * load session from store or cookie
   */
  async loadSession() {
    if (this.store) {
      await this.loadFromExtraStore();
      return;
    }
    this.loadFromCookieStore();
  }

  /**
   * load session from cookie store
   */
  loadFromCookieStore() {
    const cookie = this.request.cookies.get(this.options.key, this.options);
    if (!cookie) {
      return this.generate();
    }
    let json = {};
    try {
      json = decode(cookie);
    } catch (err) {
      return this.generate();
    }

    if (!this.verify(json)) {
      return this.generate();
    }
    return this.generate(json);
  }

  /**
   * recover session from extra store
   */
  async loadFromExtraStore() {
    this.id = this.request.cookies.get(this.options.key, this.options) || this.generateSessionId();
    const json = await this.store.get(this.id, this.options.maxAge);
    if (!this.verify(json)) {
      return this.generate();
    }
    return this.generate(json);
  }

  /**
   * verify session validity
   * @param session
   */
  verify(session: any) {
    if (!session || !is.isObject(session)) return false;
    if (session._expire && session._expire < Date.now()) return false;
    return true;
  }

  /**
   * generate session
   * @param data session data
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
   * create sessionId
   */
  generateSessionId() {
    return uuid();
  }

  /**
   * get session value
   * @param key session key
   */
  get(key: string, defaultVal?: any) {
    if (!key) return this.session;
    return this.session[key] || defaultVal;
  }

  /**
   * set a session
   * @param key session key
   * @param value session value
   */
  set(key: string, value: any) {
    if (!this.session) this.session = {};
    this.session[key] = value;
    return this;
  }

  /**
   * remove a session
   * @param key session key
   */
  remove(key: string) {
    if (!this.session) this.session = {};
    delete this.session[key];
    return this;
  }

  /**
   * push session value in array session
   * @param key
   * @param value
   */
  push(key: string, value: any) {
    const arr = this.get(key, []);
    arr.push(value);
    this.set(key, arr);
    return this;
  }

  /**
   * set a flash session
   * @param key session key
   * @param value  session value
   */
  flash(key: string, value: any) {
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
   * @param keys session keys
   */
  updateOldFlashSession(...keys: string[]) {
    const oldFlashs = this.get(symbols.SESSION.OLD_FLASHS, []);
    const _keys = oldFlashs.filter((key: string) => !keys.includes(key));
    this.set(symbols.SESSION.OLD_FLASHS, _keys);
    return this;
  }

  async commit() {
    this.ageFlashSession();
    if (!this.store) {
      const encodedSession = encode(this.session);
      this.request.cookies.set(this.options.key, encodedSession, this.options);
    } else {
      await this.store.set(this.id, this.session);
      this.request.cookies.set(this.options.key, this.id, this.options);
    }
  }

  async autoCommit() {
    if (this.options.autoCommit === true) {
      await this.commit();
    }
  }
}
