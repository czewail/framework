
const statuses = require('statuses')
const fs = require('fs')
const path = require('path')
const tracePage = require('@dazejs/trace-page')
const Container = require('../container')
const HttpError = require('./http-error')
const ValidateError = require('./validate-error')
const ResponseFactory = require('../response/factory')
const { SESSION_PREVIOUS_URL } = require('../symbol')

const defaultHttpErrorTemplate = {
  401: 'errors/401.njk',
  404: 'errors/404.njk',
  500: 'errors/500.njk',
  503: 'errors/503.njk',
}

class Handle {
  constructor(ctx) {
    this.ctx = ctx
    this.app = Container.get('app')
    this.request = Container.get('request', [ctx])
    this.response = Container.get('response', [ctx])
    this.redirect = Container.get('redirect', [ctx])
    this.view = Container.get('view', [ctx])
  }

  render(err) {
    let httpCode = 500
    if (err instanceof HttpError) {
      httpCode = err.statusCode
    }
    this.ctx.status = httpCode
    const type = this.ctx.accepts('html', 'text', 'json') || 'text'
    this.ctx.type = type
    return this[type](err)
  }

  renderTrance(err) {
    const temp = tracePage(err, this.ctx, {
      logo: `${fs.readFileSync(path.resolve(__dirname, './views/assets/logo.svg'))}<span style="vertical-align: top;line-height: 50px;margin-left: 10px;">Daze.js</span>`,
    })
    return (new ResponseFactory(temp)).output(this.ctx)
  }

  text(err) {
    return (new ResponseFactory(err.message || statuses[+err.statusCode])).output(this.ctx)
  }

  json(err) {
    const message = err.message || statuses[+err.statusCode]
    const { errors } = err
    const data = { message, errors }
    if (this.app.isDebug) {
      if (err.statusCode >= 500) {
        data.stack = err.stack
      }
    }
    return (new ResponseFactory(data)).output(this.ctx)
  }

  html(err) {
    if (err instanceof ValidateError) {
      this.ctx.status = 302
      const url = this.ctx.session[SESSION_PREVIOUS_URL] || this.ctx.get('Referrer') || '/'
      this.ctx.response.set('Location', url)
      return
    }
    if (!(err instanceof HttpError) && this.app.isDebug) {
      return this.renderTrance(err)
    }
    return this.renderHttpHtml(err)
  }

  renderHttpHtml(err) {
    const config = this.app.get('config')
    // get http_exception_template object
    const httpErrorTemplate = config.get('app.http_exception_template')
    const temps = Object.assign({}, httpErrorTemplate, defaultHttpErrorTemplate)
    // check user config s status page
    if (Reflect.has(temps, this.ctx.status)) {
      const view = this.view.render(temps[this.ctx.status] || 'errors/error.njk', {
        err,
      })
      return (new ResponseFactory(view)).output(this.ctx)
    } else if (Reflect.has(temps, 'error')) {
      const view = this.view.render(temps.error || 'errors/error.njk', {
        err,
      })
      return (new ResponseFactory(view)).output(this.ctx)
    } else {
      const view = this.view.render('errors/error.njk', {
        err,
      })
      return (new ResponseFactory(view)).output(this.ctx)
    }
  }
}

module.exports = Handle
