/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const Container = require('../container');

function injectClass(target, containers) {
  const targetProxy = new Proxy(target, {
    construct(Target, newArgs, extended) {
      const containerArgs = containers.map((container) => {
        if (Array.isArray(container)) {
          if (!Container.has(container[0])) {
            return null;
          }
          return Container.get(container[0], container[1] || []);
        } else {
          if (!Container.has(container)) {
            return null;
          }
          return Container.get(container);
        }
      });
      return Reflect.construct(Target, [...containerArgs, ...newArgs], extended);
    },
    // 修复低版本 node 的 Function.prototype.toString 不支持 proxy 的问题
    get(tar, name) {
      if (typeof name === 'symbol') return tar[name];
      if (typeof tar[name] === 'function') return tar[name].bind(target);
      return tar[name];
    },
  });
  // 修复低版本 node 的 Function.prototype.toString 不支持 proxy 的问题
  // targetProxy.toString = Function.prototype.toString.bind(target)
  return targetProxy;
}

function injectdMethod(target, name, descriptor, containers) {
  const fn = descriptor.value;
  // console.log(target, 'target')
  const fnProxy = new Proxy(fn, {
    apply(applyTarget, ctx, args) {
      if (typeof fn !== 'function') {
        throw new SyntaxError('@Inject can only be used on function or class');
      }
      const containerArgs = containers.map((container) => {
        if (!Container.has(container)) {
          return null;
        }
        return Container.get(container);
      });
      return Reflect.apply(applyTarget, ctx, [...containerArgs, ...args]);
    },
  });
  return Object.assign(descriptor, {
    value: fnProxy,
  });
}

function handle(args, containers) {
  if (args.length === 1) {
    return injectClass(...args, containers)
  } 
    return injectdMethod(...args, containers)
  
}

module.exports = function Inject(...args) {
  return function (...argsClass) {
    return handle(argsClass, args);
  };
};
