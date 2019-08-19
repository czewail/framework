/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
const assert = require('assert');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Cookie {
  /**
   * Create Cookie instance
   * @param {String} name cookie name
   * @param {*} value cookie value
   * @param {Object} options cookie options
   */
  constructor(name, value, options = {}) {
    assert(!(/\s|,|;/).test(name), new IllegalArgumentError('Cookie name is not valid!'));
    /**
     * @var {object} app Application
     */
    this.app = Container.get('app');
    /**
     * @var {string} name cookie name
     */
    this.name = name;

    /**
     * @var {string} value cookie value
     */
    this.value = value;

    /**
     * @var {Object} options cookie options
     */
    this.options = Object.assign({}, this.app.get('config').get('cookie', {}), options);
  }

  /**
   * get current cookie options
   * @public
   * @returns {object} this.options
   */
  getOptions() {
    return this.options;
  }

  /**
   * get cookie name
   * @public
   * @returns {string} cookie name
   */
  getName() {
    return this.name;
  }

  /**
   * get cookie value
   * @public
   * @returns {string} cookie value
   */
  getValue() {
    return this.value;
  }

  /**
   * set cookie value
   * @public
   * @param {string} val cookie value
   * @returns {this}
   */
  setValue(val) {
    if (val) {
      this.value = val;
    }
    return this;
  }

  /**
   * set cookie options - httpOnly
   * @public
   * @param {boolean} flag is http only?
   * @returns {this}
   */
  setHttpOnly(flag = true) {
    this.options.httpOnly = flag;
    return this;
  }

  /**
   * set cookie options - signed
   * @public
   * @param {boolean} flag should signed?
   * @returns {this}
   */
  setSigned(flag = true) {
    this.options.signed = flag;
    return this;
  }

  /**
   * set cookie should signed
   * @public
   * @returns {this}
   */
  shouldSigned() {
    this.setSigned(true);
    return this;
  }

  /**
   * set cookie dont't signed
   * @public
   * @returns {this}
   */
  doNotSigned() {
    this.setSigned(false);
    return this;
  }

  /**
   * set cookie options - maxAge
   * @public
   * @param {number} expiry cookie expire(mm)
   * @returns {this}
   */
  setMaxAge(expiry = 0) {
    this.options.maxAge = expiry;
    return this;
  }

  /**
   * set cookie options - domain
   * @public
   * @param {string} pattern cookie domain
   * @returns {this}
   */
  setDomain(pattern = '') {
    this.options.domain = pattern;
    return this;
  }

  /**
   * set cookie options - path
   * @public
   * @param {string} uri cookie uri
   * @returns {this}
   */
  setPath(uri = '/') {
    this.options.path = uri;
    return this;
  }

  /**
   * set cookie options - secure
   * @public
   * @param {boolean} flag cookie secure
   * @returns {this}
   */
  setSecure(flag = false) {
    this.options.secure = flag;
    return this;
  }

  /**
   * set cookie options - expires
   * @public
   * @param {Date} expires cookie expires
   * @returns {this}
   */
  setExpires(expires) {
    this.options.expires = expires;
    return this;
  }
}

module.exports = Cookie;
