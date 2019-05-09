const HttpError = require('./http-error');

class NotFoundHttpError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

module.exports = NotFoundHttpError;
