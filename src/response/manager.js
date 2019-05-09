
const Response = require('./index');

class Manager {
  response = null;

  constructor(data = null, code = null, headers = {}) {
    this.response = (data instanceof Response) ? data : new Response(data);
    this.response.setCode(code);
    this.response.setHeader(headers);
  }

  output(request) {
    if (!this.response) return undefined;
    this.response.send(request);
    return this.response;
  }
}

module.exports = Manager;
