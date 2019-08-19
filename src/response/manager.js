/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Response = require('./index');

class Manager {
  constructor(data = null, code = 200, headers = {}) {
    if (data instanceof Response) {
      this.response = data;
    } else {
      this.response = new Response(data, code, headers);
    }
  }

  output(request) {
    if (!this.response) return undefined;
    this.response.send(request);
    return this.response;
  }
}

module.exports = Manager;
