/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const parse = require('parseurl');
const qs = require('querystring');
const typeis = require('type-is');
const Cookies = require('cookies');
const accepts = require('accepts');
const is = require('core-util-is');
const Container = require('../container');
const Validate = require('../validate');
const ValidateError = require('../errors/validate-error');
const Session = require('../session');
const parseBody = require('./utils/parse-body');

class Request {
  constructor(req, res) {
    /**
     * @type {object} app Application
     */
    this.app = Container.get('app');

    /**
     * @type {http.IncomingMessage} req http.IncomingMessage
     */
    this.req = req;

    /**
     * @type {http.ServerResponse} res http.ServerResponse
     */
    this.res = res;

    /**
     * @type {Object} _cookies Cookies instance
     */
    this._cookies = null;

    /**
     * @type {Session} _session Session instance
     */
    this._session = null;

    /**
     * @type {Object} _accept accepts
     */
    this._accepts = null;
  }

  /**
   * initialize request
   */
  async initialize() {
    this._body = await parseBody(this);
  }

  /**
   * Return request header.
   */
  get headers() {
    return this.req.headers;
  }

  /**
   * Return request header.
   */
  getHeaders() {
    return this.headers;
  }

  /**
   * Return request header.
   * @param {String} name headers key
   */
  getHeader(name) {
    if (!name) return this.req.headers;
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
   * check if the request method is OPTIONS
   */
  isOptions() {
    return this.method === 'OPTIONS';
  }

  /**
   * check if the request method is HEAD
   */
  isHead() {
    return this.method === 'HEAD';
  }

  /**
   * check if the request method is GET
   */
  isGet() {
    return this.method === 'GET';
  }

  /**
   * check if the request method is POST
   */
  isPost() {
    return this.method === 'POST';
  }

  /**
   * check if the request method is PUT
   */
  isPut() {
    return this.method === 'PUT';
  }

  /**
   * check if the request method is PATCH
   */
  isPatch() {
    return this.method === 'PATCH';
  }

  /**
   * check if the request method is DELETE
   */
  isDelete() {
    return this.method === 'DELETE';
  }

  /**
   * Get parsed Content-Length when present.
   * @return {Number}
   */
  get length() {
    const len = this.getHeader('Content-Length');
    if (!len) return undefined;
    return len | 0; // eslint-disable-line no-bitwise
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
   * @returns {String} 'http' | 'https'
   */
  get protocol() {
    if (this.socket.encrypted) return 'https';
    const proxy = this.app.get('config').get('app.proxy');
    if (!proxy) return 'http';
    const xForwordedProto = this.getHeader('X-Forwarded-Proto');
    return xForwordedProto ? xForwordedProto.split(/\s*,\s*/, 1)[0] : 'http';
  }

  /**
   * Get request protocol
   * @returns {String} 'http' | 'https'
   */
  getProtocol() {
    return this.protocol;
  }

  /**
   * get request host
   */
  get host() {
    let host;
    const proxy = this.app.get('config').get('app.proxy');
    if (proxy) host = this.getHeader('X-Forwarded-Host');
    if (!host) {
      if (this.isHttp2) host = this.getHeader(':authority');
      if (!host) host = this.getHeader('Host');
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
    if (/^https?:\/\//i.test(this.url)) return this.url;
    return this.origin + this.url;
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
   * 根据 ? 获取原始查询字符串（不包含 ?）
   */
  get querystring() {
    return parse(this.req).query || '';
  }

  /**
   * 根据 ? 获取原始查询字符串
   */
  getQuerystring() {
    return this.querystring;
  }


  /**
   * 根据 ? 获取原始查询字符串（包含 ?）
   */
  get search() {
    if (!this.querystring) return '';
    return `?${this.querystring}`;
  }

  /**
   * 根据 ? 获取原始查询字符串（包含 ?）
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

  /**
   * Get accept object
   * @private
   */
  get accepts() {
    if (!this._accepts) this._accepts = accepts(this.req);
    return this._accepts;
  }

  /**
   * Return the types that the request accepts,
   * in the order of the client's preference (most preferred first).
   * @param  {...String} params
   */
  acceptsTypes(...params) {
    return this.accepts.types(...params);
  }

  /**
   * Return the first accepted encoding.
   * If nothing in encodings is accepted, then false is returned.
   * @param  {...String} params
   */
  acceptsEncodings(...params) {
    return this.accepts.encodings(...params);
  }

  /**
   * Return the first accepted charset.
   * If nothing in charsets is accepted, then false is returned.
   * @param  {...String} params
   */
  acceptsCharsets(...params) {
    return this.accepts.charsets(...params);
  }

  /**
   * Return the first accepted language.
   * If nothing in languages is accepted, then false is returned.
   * @param  {...String} params
   */
  acceptsLanguages(...params) {
    return this.accepts.languages(...params);
  }

  /**
   * get the cookie instance
   */
  get cookies() {
    if (!this._cookies) {
      this._cookies = new Cookies(this.req, this.res, {
        keys: this.app.keys,
        secure: this.secure,
      });
    }
    return this._cookies;
  }

  /**
   * return cookie val by name
   * @param {String} key cookie name
   * @param {Object} options cookie opts
   */
  cookie(key, options = {}) {
    return this.cookies.get(key, options);
  }

  /**
   * alias this.cookie
   * @param  {...*} params this.cookie params
   */
  cookieValue(...params) {
    return this.cookie(...params);
  }

  /**
   * session simple
   * @param {String} key session key
   * @param {*} value session value
   */
  session(key, value) {
    if (!this._session) {
      this._session = new Session(this);
    }
    if (key && !value) return this._session.get(key);
    if (key && value) return this._session.set(key, value);
    return this._session;
  }

  /**
   * get Session value
   * @param {String} key
   */
  sessionValue(key) {
    return this.session(key);
  }

  get secure() {
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

  get mergedParams() {
    if (!this._params) {
      this._params = {
        ...this.query,
        ...this.body,
      };
    }
    return this._params;
  }

  /**
   * request body params getter
   */
  get body() {
    return this._body?.fields ?? {};
  }

  /**
   * get request body params
   */
  getBody() {
    return this.body;
  }

  /**
   * request files getter
   */
  get files() {
    return this._body?.files ?? [];
  }

  /**
   * get request files
   */
  getFiles() {
    return this.files;
  }

  /**
   * Gets the parameter value based on the parameter name
   * Returns the default value when the parameter does not exist
   * @param {string} name Parameter name
   * @param {*} defaultValue default parameter value
   */
  param(name, defaultValue = null) {
    if (name) {
      return this.has(name) ? this.mergedParams[name] : defaultValue;
    }
    return this.mergedParams;
  }

  /**
   * Filter parameters
   * @param {...*} args An array of parameter names
   */
  only(...args) {
    const res = {};
    for (const arg of args) {
      if (is.isString(arg)) {
        if (this.has(arg)) {
          res[arg] = this.param(arg);
        }
      } else if (is.isArray(arg)) {
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
   * @param {...*} args An array of parameter names
   */
  except(...args) {
    let exceptKeys = [];
    let keys = Object.keys(this.mergedParams);
    for (const arg of args) {
      if (is.isString(arg)) {
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
   * validate request
   * @param {object} validator validator
   * @param {string} message message
   */
  validate(validator, message = 'Validation error') {
    const validate = new Validate(this.mergedParams, validator);
    if (validate.fails) {
      throw new ValidateError(message, validate);
    }
  }
}

/**
 * The agent Request class
 * Implement the attribute operator to get the parameter
 */
const requestProxy = new Proxy(Request, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended);
    return new Proxy(instance, {
      get(t, prop, receiver) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return Reflect.get(t, prop, receiver);
        }
        return t.param(prop);
      },
    });
  },
});

module.exports = requestProxy;
