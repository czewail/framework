const length = require('./length');

module.exports = function maxLength(value = '', max) {
  return length(value, 0, max);
};
