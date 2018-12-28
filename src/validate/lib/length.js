
const { isLength } = require('validator')

module.exports = function length(value = '', min, max) {
  return isLength(value, {
    min,
    max,
  })
}
