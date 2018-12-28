const ExceptionHandler = require('../errors/handle')

module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      const Exception = new ExceptionHandler(ctx)
      return Exception.render(err)
    }
  }
}
