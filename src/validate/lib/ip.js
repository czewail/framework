const { isIP } = require('validator');

module.exports = function ip(value, version) {
  return isIP(value, version);
};
