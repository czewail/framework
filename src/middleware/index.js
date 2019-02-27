const EventEmitter = require('events')

class Middleware extends EventEmitter {
  middlewares = [];

  constructor() {
    super()
    this.on('start', (req, res) => {
      res.end('11111111222222')
    })
  }

  use(cb) {
    if (typeof cb !== 'function') throw new Error('middleware must be a function!')
    this.middlewares.push(cb)
    return this
  }

  next(req, res, i) {
    const middleware = this.middlewares[i]
    if (!middleware) return Promise.resolve()
    try {
      return Promise.resolve(middleware(req, res, this.next.bind(this, req, res, i + 1)))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  compose() {
    return (req, res) => {
      return this.next(req, res, 0)
    }
  }
}

module.exports = Middleware
