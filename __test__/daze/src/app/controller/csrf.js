const {
  Controller, Route, Http, Csrf,
} = require('../../../../../src');


@Route('/csrf')
class CsrfController extends Controller {
  @Http.Post()
  @Csrf()
  store() {
    return 'hello';
  }
}

module.exports = CsrfController;
