/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

class IllegalArgumentError extends Error {
  constructor(message = 'Illegal Argument') {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = IllegalArgumentError;
