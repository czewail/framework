const {
  Controller, Route, Http, useMiddleware,
} = require('../../../../../src');


@Route('/csrf')
class Csrf extends Controller {
  @Http.Post()
  @useMiddleware('verify-csrf-token')
  store() {
    return 'hello';
  }
}

module.exports = Csrf;
