/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const HttpError = require('./http-error');

class NotFoundHttpError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

module.exports = NotFoundHttpError;
