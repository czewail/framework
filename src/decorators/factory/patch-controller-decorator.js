
const { METHOD_INJECTORS, PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS } = require('../../symbol')
const InjectMeta = require('../../foundation/support/meta/inject-meta')

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function (type, params, klass) {
  const meta = klass.prototype[CONSTRUCTOR_INJECTORS] || []
  const _meta = InjectMeta.get(CONSTRUCTOR_INJECTORS, klass.prototype) || []
  meta.push([type, params])
  _meta.push([type, params])
  klass.prototype[CONSTRUCTOR_INJECTORS] = meta
  InjectMeta.set(CONSTRUCTOR_INJECTORS, _meta, klass.prototype)
  return klass
}

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function (type, params, klass, name) {
  const meta = klass[PROPERTY_INJECTORS] || {}
  const _meta = InjectMeta.get(PROPERTY_INJECTORS, klass) || {}
  meta[name] = [type, params]
  _meta[name] = [type, params]
  klass[PROPERTY_INJECTORS] = meta
  InjectMeta.set(PROPERTY_INJECTORS, _meta, klass)
  return klass
}

/**
 * METHOD_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchMethod = function (type, params, klass, name) {
  const meta = klass[METHOD_INJECTORS] || {}
  const _meta = InjectMeta.get(METHOD_INJECTORS, klass) || {}
  const injectors = meta[name] || []
  const _injectors = _meta[name] || []
  injectors.push([type, params])
  _injectors.push([type, params])
  meta[name] = injectors
  _meta[name] = _injectors
  klass[METHOD_INJECTORS] = meta
  InjectMeta.set(METHOD_INJECTORS, _meta, klass)
  return klass
}
