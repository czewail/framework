/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const isUtil = require('core-util-is')
const { getInjectedConstructorArgs, getInjectedMethodArgs, getInjectedPropertyValue } = require('./args-factory')

function createInjector(Klass, ctx, callback = () => {}) {
  const KlassProxy = new Proxy(Klass, {
    construct(target, args, ext) {
      const injectedParams = getInjectedConstructorArgs(ctx.injectorContext, target)
      const instance = Reflect.construct(target, [...injectedParams, ...args], ext)
      const instanceProxy = new Proxy(instance, {
        get(t, name) {
          if (name === 'constructor') return t[name]
          if (isUtil.isFunction(t[name])) {
            return new Proxy(t[name], {
              apply(tar, thisBinding, instanceArgs) {
                const injectedMethodParams = getInjectedMethodArgs(ctx.injectorContext, t, name)
                return Reflect.apply(tar, thisBinding, [...injectedMethodParams, ...instanceArgs])
              }
            })
          } else {
            return getInjectedPropertyValue(ctx.injectorContext, t, name)
          }
        }
      })
      return instanceProxy
    }
  })
  const instance = new KlassProxy(ctx)
  callback(instance)
  return instance
}

module.exports = createInjector
