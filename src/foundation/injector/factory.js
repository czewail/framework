/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const isUtil = require('core-util-is')
// const symbols = require('../../symbol')
const { getInjectedConstructorArgs, getInjectedMethodArgs, getInjectedPropertyValue } = require('./args-factory')

function createInjector(Klass, ctx, callback = () => {}) {
  const KlassProxy = new Proxy(Klass, {
    construct(target, args, ext) {
      const injectedParams = getInjectedConstructorArgs(ctx, target)
      const instance = Reflect.construct(target, [...injectedParams, ...args], ext)
      instance.setCtx && instance.setCtx(ctx)
      const instanceProxy = new Proxy(instance, {
        get(t, name) {
          if (name === 'constructor') return t[name]
          if (isUtil.isFunction(t[name])) {
            return new Proxy(t[name], {
              apply(tar, thisBinding, instanceArgs) {
                const injectedMethodParams = getInjectedMethodArgs(ctx, t, name)
                return Reflect.apply(tar, thisBinding, [...injectedMethodParams, ...instanceArgs])
              }
            })
          } else {
            return getInjectedPropertyValue(ctx, t, name)
          }
        }
      })
      return instanceProxy
    }
  })
  const instance = new KlassProxy()
  callback(instance)
  return instance
}

module.exports = createInjector
