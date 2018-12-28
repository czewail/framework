const Container = require('../container')

class Cookie {
  app = Container.get('app');

  options = {};

  constructor(ctx) {
    this.cookies = ctx.cookies
    this.options = this.app.get('config').get('cookie')
  }

  get(name, options = {}) {
    if (!name) return
    const opts = Object.assign({}, this.options, options)
    return this.cookies.get(name, {
      signed: opts.signed
    })
  }

  set(name, value, options = {}) {
    const opts = Object.assign({}, this.options, options)
    this.cookies.set(name, value, opts)
  }
}

const CookieProxy = new Proxy(Cookie, {
  construct(Target, args, extended) {
    const instance = Reflect.construct(Target, args, extended)
    return new Proxy(instance, {
      get(t, prop) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return t[prop]
        }
        return t.cookies[prop]
      },
    })
  }
})

module.exports = CookieProxy
