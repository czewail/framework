const statuses = require('statuses');
const fs = require('fs');
const path = require('path');
const tracePage = require('@dazejs/trace-page');
const Container = require('../container');
const HttpError = require('./http-error');
const ValidateError = require('./validate-error');
const Response = require('../response');
const RedirectResponse = require('../response/redirect');
const View = require('../view');

// const { SESSION_PREVIOUS_URL } = require('../symbol');

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
     * @var {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Request} request request instance
     */
    this.request = request;

    /**
     * @var {Error} error thrown Error
     */
    this.error = error;

    /**
     * @var {Number} code error code
     */
    this.code = (this.error instanceof HttpError) ? this.error.statusCode : 500;
  }

  /**
   * render error response
   * @public
   */
  render() {
    const type = this.request.acceptsTypes('html', 'text', 'json') || 'text';
    return this[type]();
  }

  /**
   * render error response when text type
   * @private
   */
  text() {
    const data = this.error.message || statuses[+this.error.statusCode];
    return new Response(data, this.code);
  }

  /**
   * render error response when json type
   * @private
   */
  json() {
    const message = this.error.message || statuses[+this.error.statusCode];
    const { errors } = this.error;
    const data = { data: message, errors };
    if (this.app.isDebug) {
      if (this.error.statusCode >= 500) {
        data.stack = this.error.stack;
      }
    }
    return new Response(data, this.code);
  }

  /**
   * render error response when html type
   * @private
   */
  html() {
    if (this.error instanceof ValidateError) {
      // this.ctx.status = 302;
      // const url = this.ctx.session[SESSION_PREVIOUS_URL] || this.ctx.get('Referrer') || '/';
      // this.ctx.response.set('Location', url);
      // return undefined;
      // TODO: session
      return (new RedirectResponse()).go('/');
    }
    if (!(this.error instanceof HttpError) && this.app.isDebug) {
      return this.renderTracePage(this.code);
    }
    return this.renderHttpErrorPage(this.code);
  }

  /**
   * render trace page for debug
   * @private
   */
  renderTracePage() {
    const page = tracePage(this.error, this.request, {
      logo: `${fs.readFileSync(path.resolve(__dirname, './views/assets/logo.svg'))}<span style="vertical-align: top;line-height: 50px;margin-left: 10px;">Daze.js</span>`,
    });
    return new Response(page, this.code);
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
    if (temps[this.error.status]) {
      const view = (new View()).render(temps[this.error.status] || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, this.code);
    }
    if (temps.error) {
      const view = (new View()).render(temps.error || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, this.code);
    }
    const view = (new View()).render('errors/error.njk', {
      err: this.error,
    });
    return new Response(view, this.code);
  }
}

module.exports = Handler;
