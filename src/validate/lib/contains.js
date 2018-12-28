

module.exports = function contains(value, seed) {
  if (value === null || seed === null) return false
  if (typeof value.toString === 'function' && typeof seed.toString === 'function') {
    return !!~value.toString().indexOf(seed.toString())
  }
  return false
}
