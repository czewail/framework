module.exports = function (field = '', handler = () => {}, args = [], options = {}) {
  return {
    field,
    name: handler.name,
    handler,
    args,
    options,
  }
}
