/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const is = require('core-util-is');
const Response = require('./');
const symbols = require('../symbol');
const Validate = require('../validate');

class Redirect extends Response {
  /**
   * @var {boolean} needWithInput
   */
  needWithInput = false;

  /**
   *  @var {*} errors in session
   */
  errors = null;

  /**
   *  @var {*} sessions in session
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
   * @param {*} value
   */
  with(name, value) {
    if (!name || !value) return this;
    if (!this.flashSessions) this.flashSessions = {};
    if (is.isObject(name)) {
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
   * @param {Validate|*} val errors
   */
  withErrors(val) {
    if (!val) return this;
    this.errors = val;
    return this;
  }

  async send(request) {
    if (this.forceBack) {
      const url = request.session().get(symbols.SESSION.PREVIOUS) || request.getHeader('Referrer') || this.alt || '/';
      this.setUrl(url);
    }

    if (this.flashSessions) {
      const flashKeys = Object.keys(this.flashSessions);
      for (const key of flashKeys) {
        request.session().flash(key, this.flashSessions[key]);
      }
    }

    if (this.errors) {
      if (this.errors instanceof Validate) {
        request.session().flash(symbols.SESSION.ERRORS, this.errors.errors.format());
      } else {
        request.session().flash(symbols.SESSION.ERRORS, this.errors);
      }
    }
    this.setHeader('Location', this.getUrl());
    super.send(request);
  }
}

module.exports = Redirect;
