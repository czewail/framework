const EventEmitter = require('events')

class Middleware extends EventEmitter {
  middlewares = [];

  constructor() {
    super()
    this.on('start', (req, res) => {
      const middleware = this.handleMiddleware()
      return middleware(req, res).then(() => {
        res.end('111122222')
      })
    })
  }

  use(cb) {
    if (typeof cb !== 'function') throw new Error('middleware must be a function!')
    this.middlewares.push(cb)
    return this
  }

  next(req, res, i = 0) {
    const middleware = this.middlewares[i]
    if (!middleware) return Promise.resolve()
    try {
      return Promise.resolve(middleware(req, res, this.next.bind(this, req, res, i + 1)))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  handleMiddleware() {
    return (req, res) => {
      return this.next(req, res, 0)
    }
  }
}

module.exports = Middleware
