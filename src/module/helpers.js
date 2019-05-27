const symbols = require('../symbol');
const Metadata = require('../foundation/support/metadata');
const { getMiddlewares } = require('../middleware/helpers');

const SYMBOLES = {
  IS_MODULE: 'is_module',
  MIDDLEWARES: 'middlewares',
  PARENT_MIDDLEWARES: 'parent_middlewares',
};

/**
 * patch module props
 * add parent module middleware in subModule
 * @param {Class} Module Module class
 * @param {Object} parentModuleInstance parent module instance
 */
exports.patchModule = function patchModule(Module, parentModuleInstance) {
  // 向下传递中间件
  const parentModuleMiddlewares = [
    ...parentModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [],
    ...getMiddlewares(parentModuleInstance.prototype),

  ];
  const newModule = Module;
  newModule.prototype[symbols.MODULE_PARENT_MIDDLEWARES] = parentModuleMiddlewares;
  return newModule;
};

/**
 * check if sign module
 */
exports.isModule = function (target) {
  return Metadata.get(symbols.CHECKERS.MODULE, target) === true;
};

/**
 * sign module class
 */
exports.letModule = function (target) {
  Metadata.set(symbols.CHECKERS.MODULE, true, target);
};

exports.getModuleParentMiddlewares = function (target) {
  return Metadata.get(symbols.MODULE.MODULE_PARENT_MIDDLEWARES, target) || [];
};

exports.setModuleParentMiddlewares = function (target, middlewares = []) {
  Metadata.set(symbols.MODULE.MODULE_PARENT_MIDDLEWARES, middlewares, target);
};

exports.getModuleMiddlewares = function (target) {
  const currentModuleMiddlewares = getMiddlewares(target);
  const parentModuleMiddlewares = exports.getModuleParentMiddlewares(target);
  return [
    ...parentModuleMiddlewares,
    ...currentModuleMiddlewares,
  ];
};
