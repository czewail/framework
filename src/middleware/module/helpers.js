const symbols = require('../symbol');
const Metadata = require('../foundation/support/metadata');
const Middleware = require('../middleware');


/**
 * patch module props
 * add parent module middleware in subModule
 * @param {Class} Module Module class
 * @param {Object} parentModuleInstance parent module instance
 */
exports.patchModule = function patchModule(target, parentTarget) {
  const parentModuleMiddleware = Metadata.get('middleware', parentTarget.prototype) || new Middleware();

  const currenModuleMiddleware = Metadata.get('middleware', target.prototype) || new Middleware();

  currenModuleMiddleware.combineBefore(parentModuleMiddleware);

  return target;

  // // 向下传递中间件
  // const parentModuleMiddlewares = [
  //   ...parentModuleInstance[symbols.MODULE_PARENT_MIDDLEWARES] || [],
  //   ...getMiddlewares(parentModuleInstance.prototype),

  // ];
  // const newModule = Module;
  // newModule.prototype[symbols.MODULE_PARENT_MIDDLEWARES] = parentModuleMiddlewares;
  // return newModule;
};


exports.getModuleParentMiddlewares = function (target) {
  return Metadata.get(symbols.MODULE.MODULE_PARENT_MIDDLEWARES, target) || [];
};

exports.setModuleParentMiddlewares = function (target, middlewares = []) {
  Metadata.set(symbols.MODULE.MODULE_PARENT_MIDDLEWARES, middlewares, target);
};

exports.getModuleMiddleware = function (target) {
  return Metadata.get('middleware', target.prototype);
};
