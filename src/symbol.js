/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// 容器实例多例标识
exports.MULTITON = Symbol('DAZE#multiton')

// 标识控制器方法是否路由方法
exports.ISROUTE = '__DAZE_CONTROLLER_ISROUTE__'
exports.ROUTES = '__DAZE_CONTROLLER_ROUTES__'
exports.PREFIX = '__DAZE_CONTROLLER_PREFIX__'
exports.MIDDLEWARES = '__DAZE_CONTROLLER_MIDDLEWARES__'

// 标识需要注入的
exports.HTTP_CODE = '__DAZE_HTTP_CODE__'
exports.HTTP_HEADER = '__DAZE_HTTP_HEADER__'

// flash session
exports.SESSION_FLASHS = 'daze_session_flashes'
exports.SESSION_FLASHED = 'daze_flashed'
exports.SESSION_ERRORS = 'daze_errors'
exports.SESSION_OLD = 'daze_old'
exports.SESSION_PREVIOUS_URL = 'daze_previous'
exports.SESSION_CURRENT_URL = 'daze_current'
exports.SESSION_OLD_INPUT = 'daze_old_input'

exports.PROPERTY_INJECTORS = '__DAZE_PROPERTY__INJECTORS__'
exports.CONSTRUCTOR_INJECTORS = '__DAZE_CONSTRUCTOR__INJECTORS__'
exports.METHOD_INJECTORS = '__DAZE_METHOD__INJECTORS__'
// 控制器需要注入的上下文标识
exports.INJECTOR_CONETXT = {
  REQUEST: '__DAZE_INJECTOR_REQUEST__',
  RESPONSE: '__DAZE_INJECTOR_RESPONSE__',
  COOKIE: '__DAZE_INJECTOR_COOKIE__',
  SESSION: '__DAZE_INJECTOR_SESSION__',
  CTX: '__DAZE_INJECTOR_CTX__',
  NEXT: '__DAZE_INJECTOR_NEXT__',
  REDIRECT: '__DAZE_INJECTOR_REDIRECT__',
  VIEW: '__DAZE_INJECTOR_VIEW__',
  BODY: '__DAZE_INJECTOR_BODY__',
  PARAMS: '__DAZE_INJECTOR_PARAMS__',
  QUERY: '__DAZE_INJECTOR_QUERY__',
  HEADERS: '__DAZE_INJECTOR_HEADERS__',
  CONFIG: '__DAZE_INJECTOR_CONFIG__',
  APP: '__DAZE_INJECTOR_APP__',
  MESSENGER: '__DAZE_INJECTOR_MESSENGER__',
  SERVICE: '__DAZE_INJECTOR_SERVICE__',
  AXIOS: '__DAZE_INJECTOR_AXIOS__',
}

exports.MODULE_PARENT_MIDDLEWARES = Symbol('Module#parentMiddleware')
