const HttpError = require('./http-error')

class RouteNotFountException extends HttpError {
  constructor() {
    super(404, 'Route Not Found')
  }
}

module.exports = RouteNotFountException
