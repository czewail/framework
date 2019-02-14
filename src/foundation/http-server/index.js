
const http = require('http')

class HttpServer {
  middlewares = [];

  listen(...args) {
    const server = http.createServer((req, res) => {
      const middleware = this.compose()
      return this.handleRequest(req, res, middleware)
    })
    return server.listen(...args)
  }

  handleRequest(req, res, middleware) {
    return middleware(req, res)
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

module.exports = HttpServer
