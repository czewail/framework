/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const assert = require('assert');
const toIdentifier = require('toidentifier');
const statuses = require('statuses');
// const mime = require('mime');
const getType = require('cache-content-type');
const Stream = require('stream');
const { extname } = require('path');
const is = require('core-util-is');
const contentDisposition = require('content-disposition');
const Resource = require('../resource/resource');
const Container = require('../container');
const ResourceFactory = require('../resource/factory');
const ViewFactory = require('../view/factory');
const HttpError = require('../errors/http-error');
const IllegalArgumentError = require('../errors/illegal-argument-error');
const View = require('../view');
const Cookie = require('../cookie');

class Response {
  constructor(data = null, code = 200, header = {}) {
    /**
     * Application
     * @var Application
     */
    this.app = Container.get('app');

    /**
     * status code
     * @var number
     */
    this._code = code;

    /**
     * original data
     * @var mixed
     */
    this._data = data;

    /**
     * http headers
     * @var object
     */
    this._header = header;

    /**
     * 默认字符集
     * @var string
     */
    this._charset = 'utf-8';

    /**
     * 默认 contentType
     * @var string
     */
    this._contentType = 'text/html';

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
    codes.forEach((code) => {
      const name = toIdentifier(statuses[code]);
      if (code >= 400) {
        this[name] = message => this.error(message || statuses[code], code);
      } else {
        this[name] = message => this.success(message || statuses[code], code);
      }
    });
  }

  /**
   * throw http exception with code and message
   * @param {string} message exception message
   * @param {number} code exception code
   */
  error(message, code) {
    // throw new HttpError(code, message, this._header);
    this.setCode(code);
    this.setData(message);
    return this;
  }

  /**
   * set success data in ctx.body
   * @param {mixed} data data
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
   * @param {mixed} value Response header parameter value
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

  //   /**
  //  * setHeader or getHeader alias
  //  * @public
  //  */
  //   header(name, value) {
  //     if ((name && value) || is.object(name)) {
  //       return this.setHeader(name, value);
  //     } if (name && !value) {
  //       return this.getHeader(name);
  //     }
  //     return undefined;
  //   }

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
   * @returns {mixed} data
   */
  getData() {
    return this._data;
  }

  /**
   * Set the returned data
   * @public
   * @param {mixed} data Returned data
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

  /**
   * LastModified
   * @public
   * @param {string} time time
   * @returns this
   */
  lastModified(time) {
    this.setHeader('Last-Modified', time);
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
   * @param {string} time time
   * @returns this
   */
  eTag(eTag) {
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
      return (new ResourceFactory(data)).output(request);
    }
    if (data instanceof View) {
      return (new ViewFactory(data)).output(request);
    }
    return data;
  }

  withCookie(_cookie) {
    if (_cookie instanceof Cookie) {
      this.cookies.push(_cookie);
    }
    return this;
  }

  cookie(key, value, options = {}) {
    this.withCookie(new Cookie(key, value, options));
    return this;
  }

  async commitCookies(request) {
    for (const _cookie of this.cookies) {
      request.cookies.set(_cookie.getName(), _cookie.getValue(), _cookie.getOptions());
    }
    await request.session().autoCommit();
  }

  async end(request) {
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

    const data = this.handleData();

    // data
    if (Buffer.isBuffer(data) || typeof data === 'string') {
      return res.end(data);
    }
    if (typeof body === 'string') return res.end(data);
    if (data instanceof Stream) {
      // console.log(this.getCode());
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

  /**
   * send data
   * @param {*} ctx
   * @public
   */
  async send(request) {
    return this.end(request);
  }
}

module.exports = Response;
