const {
  setNeedInjector,
  getConstructorInjectors, setConstructorInjectors,
  getPropertyInjectors, setPropertyInjectors,
  getMethodInjectors, setMethodInjectors,
} = require('../../utils');

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
exports.patchClass = function patchClass(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      const injectors = getConstructorInjectors(target.prototype);
      setConstructorInjectors(target.prototype, [
        ...injectors,
        [type, params],
      ]);
      return target;
    },
  };
};

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchProperty = function patchProperty(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      setNeedInjector(target.prototype);
      const injectors = getPropertyInjectors(target.prototype);
      injectors[elementDescriptor.key] = [type, params];
      setPropertyInjectors(target.prototype, injectors);
      return target;
    },
  };
};

/**
 * METHOD_INJECTORS
 * { [name]: [ type,  params ] }
 */
exports.patchMethod = function patchMethod(type, params, elementDescriptor) {
  return {
    ...elementDescriptor,
    finisher(target) {
      setNeedInjector(target.prototype);
      const injectors = getMethodInjectors(target.prototype);
      const items = injectors[elementDescriptor.key] || [];
      items.push([type, params]);
      injectors[elementDescriptor.key] = items;
      setMethodInjectors(target.prototype, injectors);
      return target;
    },
  };
};
