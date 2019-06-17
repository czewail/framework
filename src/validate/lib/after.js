
const { isAfter } = require('validator');

module.exports = function (date) {
  let _date = date;
  if (_date instanceof Date) _date = String(_date);
  return isAfter(_date);
};
