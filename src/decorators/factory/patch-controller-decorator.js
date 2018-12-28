
const { METHOD_INJECTORS, PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS } = require('../../symbol')

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function (type, params, klass) {
  const meta = klass.prototype[CONSTRUCTOR_INJECTORS] || []
  meta.push([type, params])
  klass.prototype[CONSTRUCTOR_INJECTORS] = meta
  return klass
}

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function (type, params, klass, name) {
  const meta = klass[PROPERTY_INJECTORS] || {}
  meta[name] = [type, params]
  klass[PROPERTY_INJECTORS] = meta
  return klass
}

/**
 * METHOD_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchMethod = function (type, params, klass, name) {
  const meta = klass[METHOD_INJECTORS] || {}
  const injectors = meta[name] || []
  injectors.push([type, params])
  meta[name] = injectors
  klass[METHOD_INJECTORS] = meta
  return klass
}
