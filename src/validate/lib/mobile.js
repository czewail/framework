
const { isMobilePhone } = require('validator')

module.exports = function mobile(value, local) {
  return isMobilePhone(value, local)
}
