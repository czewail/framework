const {
  Controller, Route, Http, useService,
} = require('../../../../../src');


@Route('/example')
class Example extends Controller {
  @useService('example') userService;

  @Http.Get()
  index() {
    return this.userService.sayHello();
  }

  @Http.Post('post')
  store() {
    return {
      body: this.request.body,
      files: this.request.files,
    };
  }
}

module.exports = Example;
