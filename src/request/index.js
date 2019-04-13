/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const parse = require('parseurl');
// const is = require('core-util-is');
const qs = require('querystring');
const typeis = require('type-is');
// const buddy = require('co-body');
const Validate = require('../validate');
const ValidateError = require('../errors/validate-error');
const Session = require('../session');

const GET_MERGED_PARAMS = Symbol('Request#getMergedParams');

class Request {
  constructor(req, res) {
    // compatibility
    this.ctx = { req, res };
    this.sess = null;
    /**
     * @var {http.IncomingMessage} req http.IncomingMessage
     */
    this.req = req;

    /**
     * @var {http.ServerResponse} res http.ServerResponse
     */
    this.res = res;

    /**
     * @var {String} originalUrl http.ClinetRequest.url
     */
    this.originalUrl = req.url;

    /**
     * @var {Object} request params
     */
    this.mergedParams = this[GET_MERGED_PARAMS]();
  }

  /**
   * Return request header.
   */
  get headers() {
    return this.req.headers;
  }

  /**
   * Set request headers.
   */
  set headers(val) {
    this.req.headers = val;
  }

  /**
   * Return request header.
   * @param {String} name headers key
   */
  getHeader(name) {
    const field = name.toLowerCase();
    switch (field) {
      case 'referer':
      case 'referrer':
        return this.req.headers.referrer || this.req.headers.referer || '';
      default:
        return this.req.headers[field] || '';
    }
  }

  /**
   * Set request headers.
   * @param {String} name headers key
   * @param {Mixed} val headers value
   */
  setHeader(name, val) {
    this.req.setHeader(name, val);
    return this;
  }

  /**
   * Return request header.
   * @param {String} name
   */
  get(name) {
    return this.getHeader(name);
  }

  /**
   * Get request method.
   */
  get method() {
    return this.req.method;
  }

  /**
   * Get request method.
   */
  getMethod() {
    return this.method;
  }

  /**
   * Get parsed Content-Length when present.
   * @return {Number}
   */
  get length() {
    const len = this.getHeader('Content-Length');
    if (!len) return undefined;
    return ~~len; // eslint-disable-line no-bitwise
  }

  /**
   * Get parsed Content-Length when present.
   * @return {Number}
   */
  getLength() {
    return this.length;
  }

  /**
   * Get request URL.
   */
  get url() {
    return this.req.url;
  }

  /**
   * Get request URL.
   */
  getUrl() {
    return this.url;
  }

  /**
   * Set request URL.
   */
  set url(val) {
    this.req.url = val;
  }

  /**
   * Set request URL.
   * @param {String} val URL
   */
  setUrl(val) {
    this.url = val;
  }

  /**
   * Get original Url
   */
  getOriginalUrl() {
    return this.originalUrl;
  }

  /**
   * Get request socket
   */
  get socket() {
    return this.req.socket;
  }

  /**
   * Get request socket
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Get request protocol
   * @returns {String: 'http' | 'https'}
   */
  get protocol() {
    if (this.socket.encrypted) return 'https';
    const xForwordedProto = this.getHeader('X-Forwarded-Proto');
    return xForwordedProto ? xForwordedProto.split(/\s*,\s*/, 1)[0] : 'http';
  }

  /**
   * Get request protocol
   * @returns {String: 'http' | 'https'}
   */
  getProtocol() {
    return this.protocol;
  }

  /**
   * get request host
   */
  get host() {
    let host = '';
    if (this.isHttp2) {
      host = this.getHeader(':authority');
    } else {
      host = this.getHeader('Host');
    }
    return host ? host.split(/\s*,\s*/, 1)[0] : '';
  }

  /**
   * Get request origin
   */
  get origin() {
    return `${this.protocol}://${this.host}`;
  }

  /**
   * Get request origin
   */
  getOrigin() {
    return this.origin;
  }

  /**
   * Get request href
   */
  get href() {
    if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
    return this.origin + this.originalUrl;
  }

  /**
   * Get request href
   */
  getHref() {
    return this.href;
  }

  /**
   * Get request Path
   */
  get path() {
    return parse(this.req).pathname;
  }

  /**
   * Get request Path
   */
  getPath() {
    return this.path;
  }

  /**
   * 根据 ? 获取原始查询字符串（不包含 ？）
   */
  get querystring() {
    if (!this.req) return '';
    return parse(this.req).query || '';
  }

  /**
   * 根据 ? 获取原始查询字符串
   */
  getQuerystring() {
    return this.querystring;
  }


  /**
   * 根据 ? 获取原始查询字符串（包含 ？）
   */
  get search() {
    if (!this.querystring) return '';
    return `?${this.querystring}`;
  }

  /**
   * 根据 ? 获取原始查询字符串（包含 ？）
   */
  getSearch() {
    return this.search;
  }

  /**
   * 获取解析的查询字符串, 当没有查询字符串时，返回一个空对象
   */
  get query() {
    const str = this.querystring;
    return qs.parse(str);
  }

  /**
   * 获取解析的查询字符串, 当没有查询字符串时，返回一个空对象
   */
  getQuery() {
    return this.query;
  }

  /**
   * Get the request mime type
   */
  get type() {
    const type = this.getHeader('Content-Type');
    if (!type) return '';
    return type.split(';')[0];
  }

  /**
   * Get the request mime type
   */
  getType() {
    return this.type;
  }

  get body() {
    return this.req.body;
  }


  get port() {
    return this.socket.remotePort;
  }

  get ip() {
    return this.socket.remoteAddress;
  }


  get isSsl() {
    return this.protocol === 'https';
  }

  is(...types) {
    return typeis(this.req, types);
  }

  /**
   * Determine if the http Version is 2.0
   */
  get isHttp2() {
    return this.req.httpVersionMajor >= 2;
  }

  /**
   * Determine if the request is the result of an AJAX call.
   */
  get isAjax() {
    const x = this.request.headers['x-requested-with'];
    if (x && x.toLowerCase() === 'xmlhttprequest') {
      return true;
    }
    return false;
  }

  get expectsJson() {
    return this.isAjax || !!this.ctx.accepts('json');
  }

  /**
   * Gets the parameter value based on the parameter name
   * Returns the default value when the parameter does not exist
   * @param {string} name Parameter name
   * @param {mixed} defaultValue default parameter value
   */
  param(name, defaultValue = null) {
    if (name) {
      return this.has(name) ? this.mergedParams[name] : defaultValue;
    }
    return this.mergedParams;
  }

  /**
   * Filter parameters
   * @param {string} names An array of parameter names
   */
  only(...args) {
    const res = {};
    for (const arg of args) {
      if (typeof arg === 'string') {
        if (this.has(arg)) {
          res[arg] = this.param(arg);
        }
      } else if (Array.isArray(arg)) {
        for (const name of arg) {
          if (this.has(name)) {
            res[name] = this.param(name);
          }
        }
      }
    }
    return res;
  }


  /**
   * Filter parameters
   * @param {string} names An array of parameter names
   */
  except(...args) {
    let exceptKeys = [];
    let keys = Object.keys(this.param());
    for (const arg of args) {
      if (typeof arg === 'string') {
        exceptKeys.push(arg);
      } else if (Array.isArray(arg)) {
        exceptKeys = exceptKeys.concat(arg);
      }
    }
    keys = keys.filter(key => !~exceptKeys.indexOf(key)); // eslint-disable-line
    return this.only(keys);
  }

  /**
   * Determine whether the parameter exists
   * @param {string} name Parameter name
   */
  has(name) {
    return Reflect.has(this.mergedParams, name);
  }

  /**
   * Consolidation parameters
   */
  [GET_MERGED_PARAMS]() {
    return Object.assign({}, this.query);
  }

  /**
   * validate request
   * @param {object} validator validator
   * @param {string} message message
   */
  validate(validator, message = 'Validation error') {
    const validate = new Validate(this[GET_MERGED_PARAMS](), validator);
    if (validate.fails) {
      throw new ValidateError(message, validate);
    }
  }

  session() {
    if (!this.sess) this.sess = new Session(this.ctx);
    return this.sess;
  }

  cookie(...params) {
    return this.getCookie(...params);
  }

  getCookie(key, options = {}) {
    return this.ctx.cookies.get(key, options);
  }

  // getHeader(name) {
  //   return this.request.header[name];
  // }
}

module.exports = Request;
