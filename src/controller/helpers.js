const symbols = require('../symbol');
const Metadata = require('../foundation/support/metadata');

/**
 * sign controller class
 */
exports.letController = function (target) {
  if (target) {
    Metadata.set(symbols.CHECKERS.CONTROLLER, true, target);
  }
};

/**
 * check if sign controller
 */
exports.isController = function (target) {
  return Metadata.get(symbols.CHECKERS.CONTROLLER, target) === true;
};


/**
 * get controller route prefix
 */
exports.getControllerPrefix = function (target) {
  return Metadata.get(symbols.CONTROLLER.PREFIX, target);
};

/**
 * set controller route prefix
 */
exports.setControllerPrefix = function (target, prefix = '') {
  Metadata.set(symbols.CONTROLLER.PREFIX, prefix, target);
};

/**
 * get controller routes
 */
exports.getControllerRoutes = function (target) {
  return Metadata.get(symbols.CONTROLLER.ROUTES, target) || {};
};

/**
 * set controller routes
 */
exports.setControllerRoutes = function (target, routes = {}) {
  Metadata.set(symbols.CONTROLLER.ROUTES, routes, target);
};

/**
 * get controller middlewares
 */
exports.getControllerMiddlewares = function (target) {
  return Metadata.get(symbols.CONTROLLER.MIDDLEWARES, target) || [];
};

/**
 * set controller middlewares
 */
exports.setControllerMiddlewares = function (target, middlewares = []) {
  Metadata.set(symbols.CONTROLLER.MIDDLEWARES, middlewares, target);
};

/**
 * get controller cross origin
 */
exports.getControllerCrossOrigin = function (target) {
  return Metadata.get(symbols.CONTROLLER.CROSS_ORIGIN, target) || {};
};

/**
 * set controller cross origin
 */
exports.setControllerCrossOrigin = function (target, origins = {}) {
  Metadata.set(symbols.CONTROLLER.CROSS_ORIGIN, origins, target);
};


/**
 * get controller route middlewares
 */
exports.getControllerRouteMiddlewares = function (target) {
  return Metadata.get(symbols.CONTROLLER.ROUTE_MIDDLEWARES, target) || {};
};

/**
 * set controller route middlewares
 */
exports.setControllerRouteMiddlewares = function (target, middlewares = {}) {
  Metadata.set(symbols.CONTROLLER.ROUTE_MIDDLEWARES, middlewares, target);
};
