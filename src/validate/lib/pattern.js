
module.exports = function pattern(value, patt = '') {
  if (patt instanceof RegExp) {
    return patt.test(value);
  }
  return false;
};
