const { Controller, Http } = require('../../../../../src');


@Controller('/example')
class Example {
  @Http.Get()
  index() {
    return '';
  }
}

module.exports = Example;
