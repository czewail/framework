const {
  Controller, Route, Http,
} = require('../../../../../src');


@Route('/redirect')
class RedirectController extends Controller {
  @Http.Get()
  show() {
    return this.redirect().go('https://www.google.com');
  }
}

module.exports = RedirectController;
