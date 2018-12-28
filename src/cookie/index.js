/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const assert = require('assert')
const Container = require('../container')
const IllegalArgumentError = require('../errors/illegal-argument-error')

class Cookie {
  app = Container.get('app');

  options = {
    /** @var {number} a number representing the milliseconds from Date.now() for expiry */
    maxAge: 0,

    /** @var {Date} a Date object indicating the cookie's expiration date (expires at the end of session by default). */
    expires: '',

    /** @var {string} a string indicating the path of the cookie (/ by default). */
    path: '/',

    /** @var {boolean} a boolean indicating whether the cookie is to be signed (false by default).
     * If this is true, another cookie of the same name with the .sig suffix appended will also be sent,
     * with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the first Keygrip key.
     * This signature key is used to detect tampering the next time a cookie is received. */
    signed: true,

    /** @var {string} a string indicating the domain of the cookie (no default). */
    domain: '',

    /** @var {boolean} a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default). */
    httpOnly: true,

    /** @var {boolean} a boolean indicating whether to overwrite previously set cookies of the same name (false by default).
     * If this is true, all cookies set during the same request with the same name (regardless of path or domain)
     * are filtered out of the Set-Cookie header when setting this cookie. */
    overwrite: false,

    /** @var {boolean} a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS) */
    secure: false,
  };

  /** @var {string} cookie name */
  name = '';

  /** @var {string} cookie value */
  value = null;

  constructor(name, value, options = {}) {
    assert(!(/\s|,|;/).test(name), new IllegalArgumentError('Cookie name is not valid!'))
    this.name = name
    this.value = value
    this.options = Object.assign({}, this.options, this.app.get('config').get('cookie', {}), options)
  }

  /**
   * get current cookie options
   * @public
   * @returns {object} this.options
   */
  getOptions() {
    return this.options
  }

  /**
   * get cookie name
   * @public
   * @returns {string} cookie name
   */
  getName() {
    return this.name
  }

  /**
   * set cookie value
   * @public
   * @param {string} val cookie value
   * @returns {object} this
   */
  setValue(val = null) {
    this.value = val
    return this
  }

  /**
   * get cookie value
   * @public
   * @returns {string} cookie value
   */
  getValue() {
    return this.value
  }

  /**
   * set cookie options - httpOnly
   * @public
   * @param {boolean} flag is http only?
   * @returns {object} this
   */
  setHttpOnly(flag = true) {
    this.options.httpOnly = flag
    return this
  }

  /**
   * set cookie options - signed
   * @public
   * @param {boolean} flag should signed?
   * @returns {object} this
   */
  setSigned(flag = true) {
    this.options.signed = flag
    return this
  }

  /**
   * set cookie should signed
   * @public
   * @returns {object} this
   */
  shouldSigned() {
    this.setSigned(true)
    return this
  }

  /**
   * set cookie dont't signed
   * @public
   * @returns {object} this
   */
  doNotSigned() {
    this.setSigned(false)
    return this
  }

  /**
   * set cookie options - maxAge
   * @public
   * @param {number} expiry cookie expir(mm)
   * @returns {object} this
   */
  setMaxAge(expiry = 0) {
    this.options.maxAge = expiry
    return this
  }

  /**
   * set cookie options - domain
   * @public
   * @param {string} pattern cookie domain
   * @returns {object} this
   */
  setDomain(pattern = '') {
    this.options.domain = pattern
    return this
  }

  /**
   * set cookie options - path
   * @public
   * @param {string} uri cookie uri
   * @returns {object} this
   */
  setPath(uri = '/') {
    this.options.path = uri
    return this
  }

  /**
   * set cookie options - secure
   * @public
   * @param {boolean} flag cookie secure
   * @returns {object} this
   */
  setSecure(flag = false) {
    this.options.secure = flag
    return this
  }

  /**
   * set cookie options - expires
   * @public
   * @param {Date} expires cookie expires
   * @returns {object} this
   */
  setExpires(expires) {
    this.options.expires = expires
    return this
  }
}

module.exports = Cookie
