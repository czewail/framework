/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// 容器实例多例标识 - used
exports.MULTITON = Symbol('DAZE#multiton');

// Session Symboles - used
exports.SESSION = {
  FLASHS: 'daze__flashes',
  FLASHED: 'daze__flashed',
  PREVIOUS: 'daze__previous',
  CURRENT: 'daze__current',
  OLD_INPUT: 'daze__old_input',
  ERRORS: 'daze__errors',
};


exports.INJECT_CONTAINER_ARGS = '__DAZE_INJECT_CONTAINER_ARGS__';

exports.MIDDLEWARES = '__DAZE_CONTROLLER_MIDDLEWARES__';

// 标识需要注入的
exports.HTTP_CODE = '__DAZE_HTTP_CODE__';
exports.HTTP_HEADER = '__DAZE_HTTP_HEADER__';

// flash session
exports.SESSION_FLASHS = 'daze_session_flashes';
exports.SESSION_FLASHED = 'daze_flashed';
exports.SESSION_ERRORS = 'daze_errors';
exports.SESSION_OLD = 'daze_old';
exports.SESSION_PREVIOUS_URL = 'daze_previous';
exports.SESSION_CURRENT_URL = 'daze_current';
exports.SESSION_OLD_INPUT = 'daze_old_input';

exports.PROPERTY_INJECTORS = '__DAZE_PROPERTY__INJECTORS__';
exports.CONSTRUCTOR_INJECTORS = '__DAZE_CONSTRUCTOR__INJECTORS__';
exports.METHOD_INJECTORS = '__DAZE_METHOD__INJECTORS__';
exports.NEED_INJECTOR = '__DAZE_NEED_INJECTOR__';

exports.MODULE_PARENT_MIDDLEWARES = Symbol('Module#parentMiddleware');

// 提供者
exports.PROVIDERS = '__DAZE_PROVIDERS__';

/**
 * Inject type ids - used
 */
exports.INJECTORS = {
  REQUEST: '__DAZE_INJECT_REQUEST__',
  RESPONSE: '__DAZE_INJECT_RESPONSE__',
  REQ: '__DAZE_INJECT_REQ__',
  RES: '__DAZE_INJECT_RES__',
  QUERY: '__DAZE_INJECT_QUERY__',
  PARAMS: '__DAZE_INJECT_PARAMS__',
  BODY: '__DAZE_INJECT_BODY__',
  HEADERS: '__DAZE_INJECT_HEADERS__',
  SERVICE: '__DAZE_INJECT_SERVICE__',
  COOKIE: '__DAZE_INJECT_COOKIE__',
  SESSION: '__DAZE_INJECT_SESSION__',
  RESOURCE: '__DAZE_INJECT_RESOURCE_',
  COMPONENT: '__DAZE_INJECT_COMPONENT__',
};

/**
 * inject able - used
 */
exports.INJECT_ABLE = '__DAZE_INJECT_ABLE__';

/**
 * auto scan ignore - used
 */
exports.AUTO_SCAN_IGNORE = '__DAZE_AUTO_SCAN_IGNORE__';

/**
 * inject able class kinds - used
 */
exports.INJECTABLE_KINDS = {
  METHOD: '__DAZE_INJECT_ABLE_KIND_METHOD__',
  PROPERTY: '__DAZE_INJECT_ABLE_KIND_PROPERTY__',
  CONSTRUCTOR: '__DAZE_INJECT_ABLE_KIND_CONSTRUCTOR__',
};

/**
 * inner feat checker
 */
exports.CHECKERS = {
  MODULE: '__DAZE_CHECKER_MODULE__',
  CONTROLLER: '__DAZE_CHECKER_CONTROLLER__',
  MIDDLEWARE: '__DAZE_CHECKER_MIDDLEWARE__',
  SERVICE: '__DAZE_CHECKER_SERVICE__',
  RESOURCE: '__DAZE_CHECKER_RESOURCE__',
  COMPONENT: '__DAZE_CHECKER_COMPONENT__',
};

/**
 * module extras
 */
exports.MODULE = {
  PARENT_MIDDLEWARES: '__DAZE_MODULE_PARENT_MIDDLEWARES',
};

/**
 * controller extras
 */
exports.CONTROLLER = {
  PREFIX: '__DAZE_CONTROLLER_PREFIX__',
  ROUTES: '__DAZE_CONTROLLER_ROUTES__',
  MIDDLEWARES: '__DAZE_CONTROLLER_MIDDLEWARES__',
  ROUTE_MIDDLEWARES: '__DAZE_CONTROLLER_ROUTE_MIDDLEWARES__',
  CROSS_ORIGIN: '__DAZE_CONTROLLER_CROSS_ORIGIN__',
};

/**
 * class patch extras
 */
exports.EXTRAS = {
  MIDDLEWARES: '__DAZE_EXTRA_MIDDLEWARES__',
  COMPONENTS: '__DAZE_EXTRA_COMPONENTS__',
  NEED_INJECT: '__DAZE_EXTRA_NEED_INJECT__',
  CONSTRUCTOR_INJECTORS: '__DAZE_EXTRA_CONSTRUCTOR_INJECTORS__',
  PROPERTY_INJECTORS: '__DAZE_EXTRA_PROPERTY_INJECTORS__',
  METHOD_INJECTORS: '__DAZE_EXTRA_METHOD_INJECTORS__',
};
