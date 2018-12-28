const equals = require('./equals')

module.exports = function confirm(value, comparison) {
  return function (validate) {
    return equals(value, validate.data[comparison])
  }
}
