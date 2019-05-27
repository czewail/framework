
const Metadata = require('../foundation/support/metadata');
const symbols = require('../symbol');

exports.isMiddleware = function (target) {
  return Metadata.get(symbols.CHECKERS.MIDDLEWARE, target) === true;
};

exports.letMiddleware = function (target) {
  Metadata.set(symbols.CHECKERS.MIDDLEWARE, true, target);
};

/**
 * get module or controller middlewares
 */
exports.getMiddlewares = function (target) {
  return Metadata.get(symbols.EXTRAS.MIDDLEWARES, target) || [];
};

/**
 * set module or controller middlewares
 */
exports.setMiddlewares = function (target, middlewares = []) {
  Metadata.set(symbols.EXTRAS.MIDDLEWARES, middlewares, target);
};
