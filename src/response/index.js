/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const toIdentifier = require('toidentifier')
const statuses = require('statuses')
const extname = require('path').extname
const is = require('is-type-of')
const contentDisposition = require('content-disposition')
const Resource = require('../resource')
const Container = require('../container')
const ResourceFactory = require('../resource/factory')
const ViewFactory = require('../view/factory')
const HttpError = require('../errors/http-error')
const View = require('../view')
const Cookie = require('../cookie')

class Response {
  /**
   * Application
   * @var Application
   */
  app = Container.get('app');

  /**
   * status code
   * @var number
   */
  code = 200;

  /**
   * original data
   * @var mixed
   */
  data = null;

  /**
   * http headers
   * @var object
   */
  header = {};

  cookies = [];

  constructor(data = null, code = 200, header = {}) {
    this.patchCodeMethods()
    this.setCode(code)
    this.setData(data)
    this.setHeader(header)
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
    const { codes } = statuses
    codes.forEach(code => {
      const name = toIdentifier(statuses[code])
      if (code >= 400) {
        this[name] = message => {
          return this.error(message || statuses[code], code)
        }
      } else {
        this[name] = message => {
          return this.success(message || statuses[code], code)
        }
      }
    })
  }

  /**
   * throw http exception with code and message
   * @param {string} message exception message
   * @param {number} code exception code
   */
  error(message, code) {
    throw new HttpError(code, message)
  }

  /**
   * set success data in ctx.body
   * @param {mixed} data data
   */
  success(data, code = 200) {
    this.setCode(code)
    this.setData(data)
    return this
  }

  /**
   * get http header
   */
  getHeader() {
    return this.header
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
    if (is.object(name)) {
      this.header = Object.assign(this.header, name)
    } else {
      this.header[name] = value
    }
    return this
  }

  /**
   * getHeader alias
   * @public
   * @returns {object} http headers
   */
  getHeaders() {
    return this.getHeader()
  }

  /**
   * setHeader alias
   * @public
   * @returns {object} http headers
   */
  setHeaders(...params) {
    return this.setHeader(...params)
  }

  /**
   * get http code
   * @public
   * @returns {number} http code
   */
  getCode() {
    return this.code
  }

  /**
   * getCode alias
   * @public
   * @returns {number} http code
   */
  getStatus() {
    return this.getCode()
  }

  /**
   * set code
   * @public
   * @param {number} code status
   * @returns this
   */
  setCode(code = 200) {
    if (code) this.code = code
    return this
  }

  /**
   * setCode alias
   * @public
   * @param {number} code status
   * @returns this
   */
  setStatus(code) {
    return this.setCode(code)
  }

  /**
   * get return data
   * @public
   * @returns {mixed} data
   */
  getData() {
    return this.data
  }

  /**
   * Set the returned data
   * @public
   * @param {mixed} data Returned data
   * @returns this
   */
  setData(data) {
    if (data) this.data = data
    return this
  }

  /**
   * LastModified
   * @public
   * @param {string} time time
   * @returns this
   */
  lastModified(time) {
    this.setHeader('Last-Modified', time)
    return this
  }

  /**
   * Expires
   * @public
   * @param {string} time time
   * @returns this
   */
  expires(time) {
    this.setHeader('Expires', time)
    return this
  }

  /**
   * ETag
   * @public
   * @param {string} time time
   * @returns this
   */
  eTag(eTag) {
    this.setHeader('ETag', eTag)
    return this
  }

  /**
   * CacheControl
   * @public
   * @param {string} cache cache setting
   * @returns this
   */
  cacheControl(cache) {
    this.setHeader('Cache-Control', cache)
    return this
  }

  /**
   * Set the page to do no caching
   * @public
   * @returns this
   */
  noCache() {
    this.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
    this.setHeader('Pragma', 'no-cache')
    return this
  }

  /**
   * ContentType
   * @public
   * @param {string} contentType The output type
   * @param {string} charset The output of language
   */
  contentType(contentType, charset = 'utf-8') {
    this.setHeader('Content-Type', `${contentType}; charset=${charset}`)
    return this
  }

  /**
   * Contents-dispositions are set as "attachments" to indicate that the client prompts to download.
   * Optionally, specify the filename to be downloaded.
   * @public
   * @param {string} filename
   * @returns this
   */
  attachment(filename = null, options) {
    if (filename) this.type = extname(filename)
    this.setHeader('Content-Disposition', contentDisposition(filename, options))
    return this
  }

  /**
   * attachment alias
   * @public
   * @param {string} filename
   */
  download(data, filename = null, options) {
    return this.setData(data).attachment(filename, options)
  }

  /**
   * handle Resource data
   */
  handleData(ctx) {
    const data = this.getData()
    if (data instanceof Resource) {
      return (new ResourceFactory(data)).output(ctx)
    }
    if (data instanceof View) {
      return (new ViewFactory(data)).output(ctx)
    }
    return data
  }

  withCookie(cookie) {
    if (cookie instanceof Cookie) {
      this.cookies.push(cookie)
    }
    return this
  }

  cookie(key, value, options = {}) {
    this.withCookie(new Cookie(key, value, options))
    return this
  }

  /**
   * send data
   * @param {*} ctx
   * @public
   */
  send(ctx) {
    if (!ctx.response.headerSent) {
      // send code
      ctx.status = this.getCode()
      // send header
      ctx.set(this.getHeader())
      // send cookie
      for (const cookie of this.cookies) {
        ctx.cookies.set(cookie.getName(), cookie.getValue(), cookie.getOptions())
      }
    }
    // send data
    ctx.body = this.handleData(ctx)
  }
}

module.exports = Response