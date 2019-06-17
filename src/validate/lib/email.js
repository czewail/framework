
const { isEmail } = require('validator');

module.exports = function email(value, opts = {}) {
  return isEmail(value, opts);
};
