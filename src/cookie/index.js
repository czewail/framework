/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

const assert = require('assert');
const cookie = require('cookie');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Cookie {
  app = Container.get('app');

  options = {
    maxAge: 0,
    expires: '',
    path: '/',
    signed: true,
    domain: '',
    httpOnly: true,
    overwrite: false,
    secure: false,
  };

  /** @var {string} cookie name */
  name = '';

  /** @var {string} cookie value */
  value = null;

  /**
   * Create Cookie instance
   * @param {String} name cookie name
   * @param {Mixed} value cookie value
   * @param {Object} options cookie options
   */
  constructor(name, value, options = {}) {
    assert(!(/\s|,|;/).test(name), new IllegalArgumentError('Cookie name is not valid!'));
    this.name = name;
    this.value = value;
    this.options = Object.assign({}, this.options, this.app.get('config').get('cookie', {}), options);
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
   * set cookie value
   * @public
   * @param {string} val cookie value
   * @returns {object} this
   */
  setValue(val = null) {
    this.value = val;
    return this;
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
   * set cookie options - httpOnly
   * @public
   * @param {boolean} flag is http only?
   * @returns {object} this
   */
  setHttpOnly(flag = true) {
    this.options.httpOnly = flag;
    return this;
  }

  /**
   * set cookie options - signed
   * @public
   * @param {boolean} flag should signed?
   * @returns {object} this
   */
  setSigned(flag = true) {
    this.options.signed = flag;
    return this;
  }

  /**
   * set cookie should signed
   * @public
   * @returns {object} this
   */
  shouldSigned() {
    this.setSigned(true);
    return this;
  }

  /**
   * set cookie dont't signed
   * @public
   * @returns {object} this
   */
  doNotSigned() {
    this.setSigned(false);
    return this;
  }

  /**
   * set cookie options - maxAge
   * @public
   * @param {number} expiry cookie expir(mm)
   * @returns {object} this
   */
  setMaxAge(expiry = 0) {
    this.options.maxAge = expiry;
    return this;
  }

  /**
   * set cookie options - domain
   * @public
   * @param {string} pattern cookie domain
   * @returns {object} this
   */
  setDomain(pattern = '') {
    this.options.domain = pattern;
    return this;
  }

  /**
   * set cookie options - path
   * @public
   * @param {string} uri cookie uri
   * @returns {object} this
   */
  setPath(uri = '/') {
    this.options.path = uri;
    return this;
  }

  /**
   * set cookie options - secure
   * @public
   * @param {boolean} flag cookie secure
   * @returns {object} this
   */
  setSecure(flag = false) {
    this.options.secure = flag;
    return this;
  }

  /**
   * set cookie options - expires
   * @public
   * @param {Date} expires cookie expires
   * @returns {object} this
   */
  setExpires(expires) {
    this.options.expires = expires;
    return this;
  }

  /**
   * get serialize cookie
   */
  serialize() {
    // const signed = this.options && this.options.signed;
    // if (signed) {
    //   const signedValue = this.app.keys.sign(this.value);
    //   this.setValue(signedValue);
    // }
    return cookie.serialize(this.name, this.value, this.options);
  }

  sign() {
    if (!this.options.signed || !this.app.keys) return undefined;
    const name = `${this.name}.sig`;
    const value = this.app.keys.sign(this.value);
    return cookie.serialize(name, value, this.options);
  }
}

module.exports = Cookie;
