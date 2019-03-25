const symbols = require('../symbol');

/**
 * patch module props
 * add parent module middleware in subModule
 * @param {Class} Module Module class
 * @param {Object} parentModuleInstance parent module instance
 */
exports.patchModule = function patchModule(Module, parentModuleInstance) {
  // 向下传递中间件
  const parentModuleMiddlewares = [].concat(
    parentModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [],
    parentModuleInstance.middlewares || [],
  );
  const newModule = Module;
  newModule.prototype[symbols.MODULE_PARENT_MIDDLEWARES] = parentModuleMiddlewares;
  return newModule;
};
