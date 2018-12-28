const HttpError = require('./http-error')

class ValidateError extends HttpError {
  constructor(message = 'Validation error', validate) {
    super(422, message, validate.errors.many())
    this.validate = validate
  }
}

module.exports = ValidateError
