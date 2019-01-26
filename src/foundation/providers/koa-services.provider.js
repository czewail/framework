const Keygrip = require('keygrip')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const serve = require('koa-static')
const mount = require('koa-mount')
const Koa = require('koa')
const Csrf = require('csrf')
const Router = require('koa-router')
const session = require('koa-session')
const ErrorHandler = require('../../errors/handle')
const sessionDrivers = require('../../session/drivers')
const symbols = require('../../symbol')

class KoaServicesProvider {
  /**
   * @var {object} app Application
   */
  app = null;

  /**
   * @var {object} config Config
   */
  config = null;

  /**
   * create koa services provider
   * @param {object} app Application
   */
  constructor(app) {
    this.app = app
    this.config = app.get('config')
  }

  /**
   * Provider register Hook
   */
  register() {
    this.app.singleton('koa', Koa)

    this.app.singleton('csrf', Csrf)

    this.app.singleton('router', Router)
  }

  /**
   * Provider launch Hook
   */
  launch() {
    this.registerSecretKey()

    this.registerRequestTime()

    this.registerErrorHandler()

    this.registerRequestBody()

    this.registerCors()

    this.registerStaticServer()

    this.registerSession()

    this.registerCsrfSecret()
  }

  /**
   * register koa secret key
   */
  registerSecretKey() {
    const keys = this.config.get('app.keys', ['DAZE_KEY_1'])
    const algorithm = this.config.get('app.algorithm', 'sha1')
    const encoding = this.config.get('app.encoding', 'base64')
    this.app.get('koa').keys = new Keygrip(keys, algorithm, encoding)
  }

  /**
   * register request time on koa ctx
   */
  registerRequestTime() {
    this.app.use(async (ctx, next) => {
      ctx.requestTime = new Date()
      await next()
    })
  }

  /**
   * register koa error event handle
   */
  registerErrorHandler() {
    this.app.get('koa').on('error', (err, ctx) => {
      const error = new ErrorHandler(ctx)
      return error.render(err)
    })
  }

  /**
   * register koa-body to parse request body
   */
  registerRequestBody() {
    const bodyLimit = this.config.get('app.body_limit', '5mb')
    this.app.use(koaBody({
      multipart: true,
      stict: false,
      formLimit: bodyLimit,
      jsonLimit: bodyLimit,
      textLimit: bodyLimit,
      formidable: {
        maxFileSize: this.config.get('app.form.max_file_size', 1024 * 2014 * 2)
      }
    }))
  }

  /**
   * register cors
   */
  registerCors() {
    this.app.use(cors(this.config.get('app.cors', {})))
  }

  /**
   * register static server
   */
  registerStaticServer() {
    if (this.config.get('app.public') === true) {
      const publicPrefix = this.config.get('app.public_prefix', '/')
      this.app.use(mount(publicPrefix, serve(this.app.publicPath, {
        setHeaders(res) {
          res.setHeader('Access-Control-Allow-Origin', '*')
        }
      })))
    }
  }

  /**
   * register session
   */
  registerSession() {
    const sessionConfig = this.config.get('session', {
      key: 'daze:sess',
      rolling: false,
      renew: false,
      type: '',
      database: '',
      maxAge: 8640000,
      overwrite: true,
      httpOnly: true,
      signed: true,
    })
    const { type, database } = sessionConfig
    const sessionOpts = {
      ...sessionConfig
    }
    delete sessionOpts.type
    delete sessionOpts.database
    sessionOpts.store = this.getSessionDriver(type, database)
    this.app.use(session(sessionOpts, this.app.get('koa')))
    this.app.use((ctx, next) => {
      ctx.session[symbols.SESSION_PREVIOUS_URL] = ctx.session[symbols.SESSION_CURRENT_URL] || ''
      ctx.session[symbols.SESSION_CURRENT_URL] = ctx.request.url
      next()
    })
  }

  /**
   * get session drivers
   * @param {string} type
   * @param {string} database
   */
  getSessionDriver(type, database = '') {
    if (!type) return null
    let databaseConfig = this.config.get(`database.${type}`, {})
    if (database) databaseConfig = databaseConfig[database]
    switch (type) {
      case 'redis':
        return sessionDrivers.redisDriver(databaseConfig)
      default: null
    }
  }

  /**
   * register csrf secret
   */
  registerCsrfSecret() {
    const csrf = this.app.get('csrf')
    this.app.use(async (ctx, next) => {
      try {
        if (!ctx.session.secret) {
          ctx.session.secret = csrf.secretSync()
        }
        ctx._csrf = csrf.create(ctx.session.secret)
        await next()
      } catch (err) {
        this.app.get('koa').emit('error', err, ctx)
      }
    })
  }
}

module.exports = KoaServicesProvider
