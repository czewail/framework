
class Middlewareable {
  middlewares = [];

  use(cb) {
    if (typeof cb !== 'function') throw new Error('middleware must be a function!')
    this.middlewares.push(cb)
    return this
  }

  dispatch(req, res, next, i) {
    let middleware = this.middlewares[i]
    if (i === this.middlewares.length) middleware = next
    if (!middleware) return Promise.resolve()
    try {
      console.log(i, 'i')
      return Promise.resolve(middleware(req, res, this.dispatch.bind(this, req, res, i + 1)))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  handleMiddleware() {
    return (req, res, next) => {
      return this.dispatch(req, res, next, 0)
    }
  }
}

module.exports = Middlewareable
