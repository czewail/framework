const { Service, Component } = require('../../../../../src');

@Component('example')
class Example extends Service {
  sayHello() {
    return 'Hello Dazejs';
  }
}


module.exports = Example;
