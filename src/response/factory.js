
const Response = require('./index')

class Factory {
  response = null;

  constructor(data = null, code = null, headers = {}) {
    this.response = (data instanceof Response) ? data : new Response(data)
    this.response.setCode(code)
    this.response.setHeader(headers)
  }

  output(ctx) {
    this.response.send(ctx)
    return this.response
  }
}

module.exports = Factory
