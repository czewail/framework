/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const HttpError = require('./http-error');

class ValidateError extends HttpError {
  constructor(message = 'Validation error', validate = null) {
    super(422, message, {}, validate && validate.errors);
    this.validate = validate;
  }
}

module.exports = ValidateError;
