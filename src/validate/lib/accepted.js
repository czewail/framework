
const accepts = ['yes', 'on', true, 'true', 1, '1']

module.exports = function accepted(value) {
  return accepts.includes(value)
}
