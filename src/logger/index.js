const log4js = require('log4js')
const Container = require('../container')

class Logger {
  constructor() {
    this.app = Container.get('app')
    this.Logger = log4js.getLogger('Framework')
  }

  getApenders() {
    return {
      default: {
        type: 'dataFile',
        filename: 'default.log'
      }
    }
  }
}

module.exports = Logger
