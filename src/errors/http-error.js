/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

class HttpError extends Error {
  constructor(code = 500, message = '', headers = {}, errors = []) {
    super(message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HttpError;
