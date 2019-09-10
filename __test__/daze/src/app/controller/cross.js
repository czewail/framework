const {
  CrossOrigin, Controller, Route, Http,
} = require('../../../../../src');

@Route('cross')
class CrossController extends Controller {
  @Http.Post()
  @CrossOrigin()
  store() {
    return 'hello';
  }
}

module.exports = CrossController;
