exports.formatPrefix = function (prefix = '') {
  let _prefix = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`
  _prefix = _prefix.slice(-1) === '/' ? _prefix.slice(0, _prefix.length - 1) : _prefix
  return _prefix
}
