
const statuses = require('statuses');
const fs = require('fs');
const path = require('path');
const tracePage = require('@dazejs/trace-page');
const Container = require('../container');
const HttpError = require('./http-error');
const ValidateError = require('./validate-error');
const Response = require('../response');
const View = require('../view');

// const { SESSION_PREVIOUS_URL } = require('../symbol');

const defaultHttpErrorTemplate = {
  401: 'errors/401.njk',
  404: 'errors/404.njk',
  500: 'errors/500.njk',
  503: 'errors/503.njk',
};

class Handle {
  constructor(request, error) {
    this.request = request;
    this.error = error;
    this.app = Container.get('app');
    this.response = new Response();
    this.view = new View();
  }

  render() {
    let httpCode = 500;
    if (this.error instanceof HttpError) {
      httpCode = this.error.statusCode;
    }
    const type = this.request.acceptsTypes('html', 'text', 'json') || 'text';
    return this[type](httpCode);
  }

  text(code) {
    const data = this.error.message || statuses[+this.error.statusCode];
    return new Response(data, code);
  }

  json(code) {
    const message = this.error.message || statuses[+this.error.statusCode];
    const { errors } = this.error;
    const data = { message, errors };
    if (this.app.isDebug) {
      if (this.error.statusCode >= 500) {
        data.stack = this.error.stack;
      }
    }
    return new Response(data, code);
  }

  html(code) {
    if (this.error instanceof ValidateError) {
      // this.ctx.status = 302;
      // const url = this.ctx.session[SESSION_PREVIOUS_URL] || this.ctx.get('Referrer') || '/';
      // this.ctx.response.set('Location', url);
      // return undefined;
    }
    if (!(this.error instanceof HttpError) && this.app.isDebug) {
      return this.renderTrace(code);
    }
    return this.renderHttpHtml(code);
  }

  renderTrace(code) {
    const temp = tracePage(this.error, this.request, {
      logo: `${fs.readFileSync(path.resolve(__dirname, './views/assets/logo.svg'))}<span style="vertical-align: top;line-height: 50px;margin-left: 10px;">Daze.js</span>`,
    });
    return new Response(temp, code);
  }

  renderHttpHtml(code) {
    const config = this.app.get('config');
    // get http_exception_template object
    const httpErrorTemplate = config.get('app.http_exception_template');
    const temps = Object.assign({}, httpErrorTemplate, defaultHttpErrorTemplate);
    // check user config s status page
    if (Reflect.has(temps, this.error.status)) {
      const view = this.view.render(temps[this.error.status] || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, code);
    } if (Reflect.has(temps, 'error')) {
      const view = this.view.render(temps.error || 'errors/error.njk', {
        err: this.error,
      });
      return new Response(view, code);
    }
    const view = this.view.render('errors/error.njk', {
      err: this.error,
    });
    return new Response(view, code);
  }
}

module.exports = Handle;
