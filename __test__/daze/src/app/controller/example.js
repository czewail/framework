const { Controller, Route, Http } = require('../../../../../src');


@Route('/example')
class Example extends Controller {
  @Http.Get()
  index() {
    return '';
  }
}

module.exports = Example;
