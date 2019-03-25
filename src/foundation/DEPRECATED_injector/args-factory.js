
const { PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS, METHOD_INJECTORS } = require('../../symbol')
const Container = require('../../container')

/**
 * getInjectedConstructorArgs
 * [ [ type, params ] ]
 */
exports.getInjectedConstructorArgs = function (ctx, target) {
  const args = []
  const injectors = target.prototype[CONSTRUCTOR_INJECTORS] || []
  for (const [type, params] of injectors) {
    args.push(Container.get(type, [ctx, params]))
  }
  return args
}

/**
 * getInjectedPropertyValue
 * { [name]: [ type,  params ] }
 */
exports.getInjectedPropertyValue = function (ctx, target, name) {
  const injectors = target[PROPERTY_INJECTORS] || {}
  const [type, params] = injectors[name] || []
  return type && Container.get(type, [ctx, params]) || target[name]
  // return type && contextAdapter(injectorContext, params, type) || target[name]
}

/**
 * getInjectedMethodArgs
 * { [name]: [ type,  params ] }
 */
exports.getInjectedMethodArgs = function (ctx, target, name) {
  const args = []
  const injectors = target[METHOD_INJECTORS] || {}
  const methodInjectors = injectors[name] || []
  for (const [type, params] of methodInjectors) {
    args.push(Container.get(type, [ctx, params]))
    // args.push(contextAdapter(injectorContext, params, type))
  }
  return args
}
