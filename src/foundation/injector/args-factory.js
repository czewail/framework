
const { PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS, METHOD_INJECTORS } = require('../../symbol')
const contextAdapter = require('./conetxt-adapter')

/**
 * getInjectedConstructorArgs
 * [ [ type, params ] ]
 */
exports.getInjectedConstructorArgs = function (injectorContext, target) {
  const args = []
  const injectors = target.prototype[CONSTRUCTOR_INJECTORS] || []
  for (const [type, params] of injectors) {
    args.push(contextAdapter(injectorContext, params, type))
  }
  return args
}

/**
 * getInjectedPropertyValue
 * { [name]: [ type,  params ] }
 */
exports.getInjectedPropertyValue = function (injectorContext, target, name) {
  const injectors = target[PROPERTY_INJECTORS] || {}
  const [type, params] = injectors[name] || []
  return type && contextAdapter(injectorContext, params, type) || target[name]
}

/**
 * getInjectedMethodArgs
 * { [name]: [ type,  params ] }
 */
exports.getInjectedMethodArgs = function (injectorContext, target, name) {
  const args = []
  const injectors = target[METHOD_INJECTORS] || {}
  const methodInjectors = injectors[name] || []
  for (const [type, params] of methodInjectors) {
    args.push(contextAdapter(injectorContext, params, type))
  }
  return args
}
