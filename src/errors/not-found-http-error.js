const HttpError = require('./http-error')

class NotFoundHttpError extends HttpError {
  constructor(message = 'Not Found Http Error') {
    super(404, message)
  }
}

module.exports = NotFoundHttpError
