
class HttpError extends Error {
  constructor(statusCode = 500, message = '', errors = []) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.status = statusCode;
    this.errors = errors;
  }

  get statusCode() {
    return this.status;
  }
}

module.exports = HttpError;
