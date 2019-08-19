
const Base = require('./base');

class Provider extends Base {
  async registerProvider(_Provider) {
    await this.app.register(new _Provider(this.app));
    return this;
  }

  useMiddleware(_Middleware) {
    if (!this.app.has('middleware')) return this;
    this.app.get('middleware').register(_Middleware);
    return this;
  }
}

module.exports = Provider;
