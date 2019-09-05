/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const assert = require('assert');
const toIdentifier = require('toidentifier');
const statuses = require('statuses');
const getType = require('cache-content-type');
const Stream = require('stream');
const { extname } = require('path');
const is = require('core-util-is');
const contentDisposition = require('content-disposition');
const Resource = require('../resource/resource');
const Container = require('../container');
const ViewFactory = require('../view/factory');
const IllegalArgumentError = require('../errors/illegal-argument-error');
const View = require('../view');
const Cookie = require('../cookie');

class Response {
  constructor(data = null, code = 200, header = {}) {
    /**
     * Application
     * @type Application
     */
    this.app = Container.get('app');

    /**
     * status code
     * @type {number}
     */
    this._code = code;

    /**
     * http headers
     * @type {object}
     */
    this._header = this.parseHeaders(header);

    /**
     * original data
     * @type {*}
     */
    this._data = data;

    this.cookies = [];

    this.patchCodeMethods();
  }

  set code(code) {
    this.setCode(code);
  }

  get code() {
    return this._code;
  }

  set data(data) {
    this.setData(data);
  }

  get data() {
    return this._data;
  }

  // parseData(data) {
  //   const shouldSetType = !this.getHeader('content-type');
  //   if (Buffer.isBuffer(data)) {
  //     if (shouldSetType) this.setType('bin');
  //     this.setLength(data.length);
  //   } else if (typeof data === 'string') {
  //     if (shouldSetType) this.setType(/^\s*</.test(data) ? 'html' : 'text');
  //     this.setLength(Buffer.byteLength(data));
  //   } else if (data instanceof Stream) {
  //     if (shouldSetType) this.setType('bin');
  //   } else {
  //     this.setType('json');
  //   }
  //   return data;
  // }

  /**
   * parse init headers
   * @param {object} headers
   */
  parseHeaders(headers) {
    assert(is.isObject(headers), new IllegalArgumentError('header name must be object'));
    const keys = Object.keys(headers);
    const _headers = {};
    for (const key of keys) {
      _headers[key.toLocaleLowerCase()] = headers[key];
    }
    return _headers;
  }

  /**
   * patch code methods
   *
   * SUCCESS
   *
   * 100 Continue
   * 101 SwitchingProtocols
   * 102 Processing
   * 103 EarlyHints
   * 200 OK
   * 201 Created
   * 202 Accepted
   * 203 NonAuthoritativeInformation
   * 204 NoContent
   * 205 ResetContent
   * 206 PartialContent
   * 207 MultiStatus
   * 208 AlreadyReported
   * 226 IMUsed
   * 300 MultipleChoices
   * 301 MovedPermanently
   * 302 Found
   * 303 SeeOther
   * 304 NotModified
   * 305 UseProxy
   * 306 Unused
   * 307 TemporaryRedirect
   * 308 PermanentRedirect
   *
   * ERROR
   *
   * 400 BadRequest
   * 401 Unauthorized
   * 402 PaymentRequired
   * 403 Forbidden
   * 404 NotFound
   * 405 MethodNotAllowed
   * 406 NotAcceptable
   * 407 ProxyAuthenticationRequired
   * 408 RequestTimeout
   * 409 Conflict
   * 410 Gone
   * 411 LengthRequired
   * 412 PreconditionFailed
   * 413 PayloadTooLarge
   * 414 URITooLong
   * 415 UnsupportedMediaType
   * 416 RangeNotSatisfiable
   * 417 ExpectationFailed
   * 418 ImATeapot
   * 421 MisdirectedRequest
   * 422 UnprocessableEntity
   * 423 Locked
   * 424 FailedDependency
   * 425 UnorderedCollection
   * 426 UpgradeRequired
   * 428 PreconditionRequired
   * 429 TooManyRequests
   * 431 RequestHeaderFieldsTooLarge
   * 451 UnavailableForLegalReasons
   * 500 InternalServerError
   * 501 NotImplemented
   * 502 BadGateway
   * 503 ServiceUnavailable
   * 504 GatewayTimeout
   * 505 HTTPVersionNotSupported
   * 506 VariantAlsoNegotiates
   * 507 InsufficientStorage
   * 508 LoopDetected
   * 509 BandwidthLimitExceeded
   * 510 NotExtended
   * 511 NetworkAuthenticationRequired
   * @private
   */
  patchCodeMethods() {
    const { codes } = statuses;
    for (const code of codes) {
      const name = toIdentifier(statuses[code]);
      if (code >= 400) {
        this[name] = message => this.error(message || statuses[code], code);
      } else {
        this[name] = message => this.success(message || statuses[code], code);
      }
    }
  }

  staticServer() {
    this._isStaticServer = true;
    return this;
  }

  /**
   * throw http exception with code and message
   * @param {string} message exception message
   * @param {number} code exception code
   */
  error(message, code) {
    this.setCode(code);
    this.setData(message);
    return this;
  }

  /**
   * set success data in ctx.body
   * @param {*} data data
   * @param {number} code http code
   */
  success(data, code = 200) {
    this.setCode(code);
    this.setData(data);
    return this;
  }

  /**
   * get http header
   */
  getHeader(name) {
    assert(is.isString(name), new IllegalArgumentError('header name must be string'));
    return this._header[name.toLowerCase()];
  }

  /**
   * Set response header
   * The original response headers are merged when the name is passed in as object
   *
   * @param {object|string} name Response header parameter name
   * @param {*} value Response header parameter value
   * @returns {this}
   */
  setHeader(name, value) {
    assert(is.isString(name), new IllegalArgumentError('header name must be string'));
    this._header[name.toLowerCase()] = value;
    return this;
  }

  /**
   * getHeader alias
   * @public
   * @returns {object} http headers
   */
  getHeaders() {
    return this._header;
  }

  /**
   * setHeader alias
   * @public
   * @returns {object} http headers
   */
  setHeaders(headers) {
    assert(is.isObject(headers), new IllegalArgumentError('header name must be object'));
    const keys = Object.keys(headers);
    for (const key of keys) {
      this.setHeader(key.toLowerCase(), headers[key]);
    }
    return this;
  }

  /**
   * get http code
   * @public
   * @returns {number} http code
   */
  getCode() {
    return this.code;
  }

  /**
   * getCode alias
   * @public
   * @returns {number} http code
   */
  getStatus() {
    return this.getCode();
  }

  /**
   * set code
   * @public
   * @param {number} code status
   * @returns this
   */
  setCode(code = 200) {
    if (code) this._code = code;
    return this;
  }

  /**
   * setCode alias
   * @public
   * @param {number} code status
   * @returns this
   */
  setStatus(code) {
    return this.setCode(code);
  }

  /**
   * get return data
   * @public
   * @returns {*} data
   */
  getData() {
    return this._data;
  }

  /**
   * Set the returned data
   * @public
   * @param {*} data Returned data
   * @returns this
   */
  setData(data) {
    if (data) this._data = data;
    return this;
  }

  setType(type) {
    const _type = getType(type);
    if (_type) {
      this.setHeader('Content-Type', _type);
    }
    return this;
  }

  setLength(length) {
    this.setHeader('Content-Length', length);
    return this;
  }

  setVary(field) {
    const varyHeader = this.getHeader('Vary') ?? '';
    const varys = varyHeader.split(',');
    varys.push(field);
    this.setHeader('Vary', varys.filter(v => !!v).join(','));
  }

  /**
   * LastModified
   * @public
   * @param {string} time time
   * @returns this
   */
  lastModified(time) {
    if (time instanceof Date) {
      this.setHeader('Last-Modified', time.toUTCString());
      return this;
    }
    if (typeof time === 'string' || typeof time === 'number') {
      this.setHeader('Last-Modified', (new Date(time)).toUTCString());
      return this;
    }
    return this;
  }

  /**
   * Expires
   * @public
   * @param {string} time time
   * @returns this
   */
  expires(time) {
    this.setHeader('Expires', time);
    return this;
  }

  /**
   * ETag
   * @public
   * @param {string} eTag eTag
   * @returns this
   */
  eTag(eTag) {
    if (!/^(W\/)?"/.test(eTag)) {
      this.setHeader('ETag', `"${eTag}"`);
      return this;
    }
    this.setHeader('ETag', eTag);
    return this;
  }

  /**
   * CacheControl
   * @public
   * @param {string} cache cache setting
   * @returns this
   */
  cacheControl(cache) {
    this.setHeader('Cache-Control', cache);
    return this;
  }

  /**
   * Set the page to do no caching
   * @public
   * @returns this
   */
  noCache() {
    this.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    this.setHeader('Pragma', 'no-cache');
    return this;
  }

  /**
   * ContentType
   * @public
   * @param {string} contentType The output type
   * @param {string} charset The output of language
   */
  contentType(contentType, charset = 'utf-8') {
    this.setHeader('Content-Type', `${contentType}; charset=${charset}`);
    return this;
  }

  /**
   * Contents-dispositions are set as "attachments" to indicate that the client prompts to download.
   * Optionally, specify the filename to be downloaded.
   * @public
   * @param {string} filename
   * @returns this
   */
  attachment(filename = null, options) {
    if (filename) this.type = extname(filename);
    this.setHeader('Content-Disposition', contentDisposition(filename, options));
    return this;
  }

  /**
   * attachment alias
   * @public
   * @param {string} filename
   */
  download(data, filename = null, options) {
    return this.setData(data).attachment(filename, options);
  }

  /**
   * handle Resource data
   */
  handleData(request) {
    const data = this.getData();
    if (data instanceof Resource) {
      return data.output();
    }
    if (data instanceof View) {
      return (new ViewFactory(data)).output(request);
    }
    return this.prepareData(data);
  }

  /**
   * response with cookie instance
   * @param {Cookie} _cookie
   */
  withCookie(_cookie) {
    if (_cookie instanceof Cookie) {
      this.cookies.push(_cookie);
    }
    return this;
  }

  /**
   * response with cookie
   * @param {String} key
   * @param {*} value
   * @param {Object} options
   */
  cookie(key, value, options = {}) {
    this.withCookie(new Cookie(key, value, options));
    return this;
  }

  /**
   * set json response type
   */
  json() {
    this.setType('json');
    return this;
  }

  /**
   * set html response type
   */
  html() {
    this.setType('html');
    return this;
  }

  /**
   * set html response type
   */
  text() {
    this.setType('text');
    return this;
  }

  async commitCookies(request) {
    for (const _cookie of this.cookies) {
      request.cookies.set(_cookie.getName(), _cookie.getValue(), _cookie.getOptions());
    }
    await request.session().autoCommit();
  }

  prepareData(data) {
    const shouldSetType = !this.getHeader('content-type');
    if (Buffer.isBuffer(data)) {
      if (shouldSetType) this.setType('bin');
      this.setLength(data.length);
    } else if (typeof data === 'string') {
      if (shouldSetType) this.setType(/^\s*</.test(data) ? 'html' : 'text');
      this.setLength(Buffer.byteLength(data));
    } else if (data instanceof Stream) {
      if (shouldSetType) this.setType('bin');
    } else {
      this.setType('json');
    }
    return data;
  }

  /**
   * send data
   * @param {*} request
   * @public
   */
  async send(request) {
    const data = this.handleData(request);

    const { req, res } = request;

    // headers
    if (!res.headersSent) {
      const headers = this.getHeaders();
      const code = this.getCode();

      res.statusCode = code;
      if (req.httpVersionMajor < 2) {
        res.statusMessage = statuses[code];
      }

      for (const key of Object.keys(headers)) {
        res.setHeader(key, headers[key]);
      }
    }

    if (Buffer.isBuffer(data) || typeof data === 'string') {
      return res.end(data);
    }

    if (data instanceof Stream) {
      return data.pipe(res);
    }

    // json
    const jsonData = JSON.stringify(data);
    if (!res.headersSent) {
      res.setHeader('Content-Length', Buffer.byteLength(jsonData));
    }

    res.end(jsonData);
    return undefined;
  }
}

module.exports = Response;
