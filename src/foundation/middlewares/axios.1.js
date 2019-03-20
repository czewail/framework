
const axios = require('axios')
const Middleware = require('../../base/middleware')

/**
 * @see https://github.com/axios/axios
 */
class Axios extends Middleware {
  factory(ax) {
    return ax
  }

  async handle(ctx, next) {
    ctx.$http = ctx.axios = this.factory(axios)
    await next()
  }
}

module.exports = Axios
