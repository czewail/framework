
const { decode, encode } = require('../helpers');

class CookieStore {
  constructor(request, options) {
    this.request = request;
    this.options = options;
    this.session = {};
  }

  get() {
    const cookies = this.request.cookies.get(this.options.key, this.options);
    let json;
    try {
      json = decode(cookies);
    } catch (err) {
      json = {};
    }
    return json;
  }

  set() {

  }

  destroy() {

  }
}


module.exports = CookieStore;
