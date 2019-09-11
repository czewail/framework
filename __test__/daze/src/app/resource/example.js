const { Resource, Component } = require('../../../../../src');

@Component('example')
class Example extends Resource {
  resolve(data) {
    return {
      ...data,
      type: 'node',
    };
  }
}

module.exports = Example;
