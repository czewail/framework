
const {
  METHOD_INJECTORS, PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS, NEED_INJECTOR,
} = require('../../symbol');
const InjectMeta = require('../../foundation/support/meta/inject-meta');

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function patchClass(type, params, klass) {
  InjectMeta.set(NEED_INJECTOR, true, klass.prototype);
  const meta = InjectMeta.get(CONSTRUCTOR_INJECTORS, klass.prototype) || [];
  meta.push([type, params]);
  InjectMeta.set(CONSTRUCTOR_INJECTORS, meta, klass.prototype);
  return klass;
};

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function patchProperty(type, params, klass, name) {
  InjectMeta.set(NEED_INJECTOR, true, klass);
  const meta = InjectMeta.get(PROPERTY_INJECTORS, klass) || {};
  meta[name] = [type, params];
  InjectMeta.set(PROPERTY_INJECTORS, meta, klass);
  return klass;
};

/**
 * METHOD_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchMethod = function patchMethod(type, params, klass, name) {
  // console.log(type, params, klass, name);
  InjectMeta.set(NEED_INJECTOR, true, klass);
  const meta = InjectMeta.get(METHOD_INJECTORS, klass) || {};
  const injectors = meta[name] || [];
  injectors.push([type, params]);
  meta[name] = injectors;
  InjectMeta.set(METHOD_INJECTORS, meta, klass);
  return klass;
};
