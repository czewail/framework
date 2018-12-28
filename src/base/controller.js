const Base = require('./base')

class Controller extends Base {
  render(...params) {
    return this.view.render(...params)
  }

  assign(...params) {
    return this.view.assign(...params)
  }
}

module.exports = Controller
