const { isAlpha } = require('validator');

module.exports = function alpha(value, locale) {
  return isAlpha(value, locale);
};
