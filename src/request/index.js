/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const parse = require('parseurl');
const qs = require('querystring');
const typeis = require('type-is');
const cookie = require('cookie');
const accepts = require('accepts');
const vary = require('vary');
const Keygrip = require('keygrip');
const Container = require('../container');
const Validate = require('../validate');
const ValidateError = require('../errors/validate-error');
const Session = require('../session');

class Request {
  constructor(req, res) {
    /**
     * @var {object} app Application
     */
    this.app = Container.get('app');

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
     * @var {Object} _cookies Cookies instance
     */
    this._cookies = {};

    /**
     * @var {Session} _session Session instance
     */
    this._session = null;

    /**
     * @var {Object} _accept accepts
     */
    this._accept = null;
  }

  /**
   * Return request header.
   */
  get headers() {
    return this.req.headers;
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
      this._cookies = cookie.parse(this.getHeader('Cookie'));
    }
    return this._cookies;
  }

  /**
   * return cookie val by name
   * @param {String} key cookie name
   * @param {Object} options cookie opts
   */
  cookie(key, options = {}) {
    const defaultOptions = this.app.get('config').get('cookie', {});
    const signed = options && options.signed !== undefined ? options.signed : !!this.app.keys;
    return this.cookies && this.cookies[key];
  }

  /**
   * alias this.cookie
   * @param  {...any} params this.cookie params
   */
  getCookie(...params) {
    return this.cookie(...params);
  }

  session(key, value) {
    if (!this._session) {
      this._session = new Session(this);
    }
    if (key && !value) return this._session.get(key);
    if (key && value) return this._session.set(key, value);
    return this._session;
  }

  sessionValue(key) {
    return this.session(key);
  }

  // get port() {
  //   return this.socket.remotePort;
  // }

  // get ip() {
  //   return this.socket.remoteAddress;
  // }


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

  // get expectsJson() {
  //   return this.isAjax || !!this.ctx.accepts('json');
  // }

  get mergedParams() {
    return {
      ...this.query,
      ...this.body || {},
    };
  }

  get body() {
    return this.req.body;
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

  // session() {
  //   // if (!this.sess) this.sess = new Session(this.ctx);
  //   // return this.sess;
  // }
}

/**
 * The agent Request class
 * Implement the attribute operator to get the parameter
 */
const requestProxy = new Proxy(Request, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended);
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop];
        }
        return t.param(prop);
      },
    });
  },
});

module.exports = requestProxy;
