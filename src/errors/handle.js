/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const statuses = require('statuses');
const fs = require('fs');
const path = require('path');
const typeis = require('type-is').is;
const tracePage = require('@dazejs/trace-page');
const Container = require('../container');
const HttpError = require('./http-error');
const ValidateHttpError = require('./validate-http-error');
const Response = require('../response');
const RedirectResponse = require('../response/redirect');
const View = require('../view');

const defaultHttpErrorTemplate = {
  401: 'errors/401.njk',
  404: 'errors/404.njk',
  500: 'errors/500.njk',
  503: 'errors/503.njk',
};

class Handler {
  /**
   * Create Application Error Handler
   */
  constructor(request, error) {
    /**
     * @type {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @type {Request} request request instance
     */
    this.request = request;

    /**
     * @type {HttpError} error thrown Error
     */
    this.error = error;

    /**
     * @type {Number} code error code
     */
    this.code = (this.error instanceof HttpError) ? this.error.code : 500;
  }


  /**
   * render error response
   * @public
   */
  render() {
    const type = typeis(this.error.headers && this.error.headers['content-type'], ['html', 'text', 'json']) || this.request.acceptsTypes('html', 'text', 'json') || 'text';
    return this[type]();
  }

  /**
   * render error response when text type
   * @private
   */
  text() {
    const data = this.error.message || statuses[+this.error.code];
    return new Response(data, this.code, this.error.headers).setType('txt');
  }

  /**
   * render error response when json type
   * @private
   */
  json() {
    const message = this.error.message || statuses[+this.error.code];
    const { errors } = this.error;
    const data = { message, errors };
    if (this.app.isDebug) {
      if (this.error.code >= 500) {
        data.stack = this.error.stack;
      }
    }
    return new Response(data, this.code, this.error.headers).setType('json');
  }

  /**
   * render error response when html type
   * @private
   */
  html() {
    if (this.error instanceof ValidateHttpError) {
      // this.ctx.status = 302;
      // const url = this.ctx.session[SESSION_PREVIOUS_URL] || this.ctx.get('Referrer') || '/';
      // this.ctx.response.set('Location', url);
      // return undefined;
      // TODO: session
      return (new RedirectResponse()).back();
    }
    if (!(this.error instanceof HttpError) && this.app.isDebug) {
      return this.renderTracePage();
    }
    return this.renderHttpErrorPage();
  }

  /**
   * render trace page for debug
   * @private
   */
  renderTracePage() {
    const page = tracePage(this.error, this.request);
    return new Response(page, this.code, this.error.headers).setType('html');
  }

  /**
   * render http error page
   * @private
   */
  renderHttpErrorPage() {
    const config = this.app.get('config');
    // get http_exception_template object
    const httpErrorTemplate = config.get('app.errors_page', {});
    const temps = Object.assign({}, httpErrorTemplate, defaultHttpErrorTemplate);
    // check user config s status page
    if (temps[this.error.code]) {
      const view = (new View()).render(temps[this.error.code] || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, this.code, this.error.headers).setType('html');
    }
    if (temps.error) {
      const view = (new View()).render(temps.error || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, this.code, this.error.headers).setType('html');
    }
    const view = (new View()).render('errors/error.njk', {
      err: this.error,
    });
    return new Response(view, this.code, this.error.headers).setType('html');
  }
}

module.exports = Handler;
