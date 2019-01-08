

class IllegalArgumentError extends Error {
  constructor(message = 'illegal argument') {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = IllegalArgumentError
