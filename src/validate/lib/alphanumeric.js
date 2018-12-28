const { isAlphanumeric } = require('validator')

module.exports = function alphanumeric(value, locale) {
  return isAlphanumeric(value, locale)
}
