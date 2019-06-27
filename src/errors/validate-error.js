const HttpError = require('./http-error');

class ValidateError extends HttpError {
  constructor(message = 'Validation error', validate = null) {
    super(422, message, {}, validate && validate.errors);
    this.validate = validate;
  }
}

module.exports = ValidateError;
