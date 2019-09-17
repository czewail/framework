/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import assert from 'assert'
import { Container } from '../container'
import { IllegalArgumentError} from '../errors/illegal-argument-error'

export class Cookie {
  app: any;
  name: string;
  value: string;
  options: any;
  /**
   * Create Cookie instance
   */
  constructor(name: string, value: string, options = {}) {
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
   */
  getOptions() {
    return this.options;
  }

  /**
   * get cookie name
   */
  getName() {
    return this.name;
  }

  /**
   * get cookie value
   */
  getValue() {
    return this.value;
  }

  /**
   * set cookie value
   */
  setValue(val: string) {
    if (val) {
      this.value = val;
    }
    return this;
  }

  /**
   * set cookie options - httpOnly
   */
  setHttpOnly(flag = true) {
    this.options.httpOnly = flag;
    return this;
  }

  /**
   * set cookie options - signed
   */
  setSigned(flag = true) {
    this.options.signed = flag;
    return this;
  }

  /**
   * set cookie should signed
   */
  shouldSigned() {
    this.setSigned(true);
    return this;
  }

  /**
   * set cookie dont't signed
   */
  doNotSigned() {
    this.setSigned(false);
    return this;
  }

  /**
   * set cookie options - maxAge
   */
  setMaxAge(expiry = 0) {
    this.options.maxAge = expiry;
    return this;
  }

  /**
   * set cookie options - domain
   */
  setDomain(pattern = '') {
    this.options.domain = pattern;
    return this;
  }

  /**
   * set cookie options - path
   */
  setPath(uri = '/') {
    this.options.path = uri;
    return this;
  }

  /**
   * set cookie options - secure
   */
  setSecure(flag = false) {
    this.options.secure = flag;
    return this;
  }

  /**
   * set cookie options - expires
   */
  setExpires(expires: any) {
    this.options.expires = expires;
    return this;
  }
}
