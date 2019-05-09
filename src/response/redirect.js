
const is = require('is-type-of');
const Response = require('./');
const Validate = require('../validate');
const Container = require('../container');
const { SESSION_ERRORS, SESSION_OLD_INPUT, SESSION_PREVIOUS_URL } = require('../symbol');

class Redirect extends Response {
  /**
   * @var {boolean} needWithInput
   */
  needWithInput = false;

  /**
   *  @var {mixed} errors in session
   */
  errors = null;

  /**
   *  @var {mixed} sessions in session
   */
  flashSessions = null;

  /**
   * @var {string} alt
   */
  alt = null;

  /**
   * force redirect back
   */
  forceBack = false;

  constructor(url = null, code = 302, header = {}) {
    super(url, code, header);
    this.cacheControl('no-cache,must-revalidate');
  }

  /**
   * 设置重定向地址
   * @param {string} url
   * @param {number} code
   */
  setUrl(url) {
    this.setData(url);
    return this;
  }

  /**
   * alias setUrl
   */
  go(url, code = 302) {
    this.setUrl(url).setCode(code);
    return this;
  }

  /**
   * 获取跳转地址
   */
  getUrl() {
    const data = this.getData();
    return data;
  }

  /**
   * 设置重定向地址
   * @param {string} alt
   * @param {number} code
   */
  back(alt, code = 302) {
    this.alt = alt;
    this.forceBack = true;
    this.setCode(code);
    return this;
  }

  /**
   * withInput
   */
  withInput() {
    this.needWithInput = true;
  }

  /**
   * 保存一次性 session
   * @param {object|string} name
   * @param {mixed} value
   */
  with(name, value) {
    if (!name || !value) return this;
    if (!this.flashSessions) this.flashSessions = {};
    if (is.object(name)) {
      Object.keys(name).forEach((key) => {
        this.flashSessions[key] = name[key];
      });
    } else {
      this.flashSessions[name] = value;
    }
    return this;
  }

  /**
   * withErrors
   * @param {Validate|mixed} val errors
   */
  withErrors(val) {
    if (!val) return this;
    this.errors = val;
    return this;
  }

  send(ctx) {
    const session = Container.get('session', [ctx]);
    if (this.forceBack) {
      const url = session.get(SESSION_PREVIOUS_URL) || this.ctx.get('Referrer') || this.alt || '/';
      this.setUrl(url);
    }
    if (this.needWithInput) {
      const old = ctx.params;
      session.flash(SESSION_OLD_INPUT, old);
    }
    if (this.flashSessions) {
      session.flash(this.flashSessions);
    }
    if (this.errors) {
      if (this.errors instanceof Validate) {
        session.flash(SESSION_ERRORS, this.errors.errors.many());
      } else {
        session.flash(SESSION_ERRORS, this.errors);
      }
    }
    this.setHeader('Location', this.getUrl());
    super.send(ctx);
  }
}

module.exports = Redirect;
