const {
  Controller, Route, Http,
} = require('../../../../../src');


@Route('/resource')
class ResourceController extends Controller {
  @Http.Get('item')
  show() {
    return this.resource('example').item({
      name: 'dazejs',
    });
  }

  @Http.Get('collection')
  index() {
    return this.resource('example').collection([{
      name: 'dazejs',
    }, {
      name: 'dazejs',
    }]);
  }
}

module.exports = ResourceController;
