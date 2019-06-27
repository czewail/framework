
class HttpError extends Error {
  constructor(code = 500, message = '', headers = {}, errors = []) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
  }
}

module.exports = HttpError;
