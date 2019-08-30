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
  NEW_FLASHS: 'daze__new_flashes',
  OLD_FLASHS: 'daze__old_flashes',
  PREVIOUS: 'daze__previous',
  CURRENT: 'daze__current',
  OLD_INPUT: 'daze__old_input',
  ERRORS: 'daze__errors',
};

// 标识需要注入的
exports.HTTP_CODE = '__DAZE_HTTP_CODE__';
exports.HTTP_HEADER = '__DAZE_HTTP_HEADER__';

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
  VALIDATOR: '__DAZE_INJECT_VALIDATOR__',
};

/**
 * inject able - used
 */
exports.INJECT_ABLE = '__DAZE_INJECT_ABLE__';

/**
 * inject able class kinds - used
 */
exports.INJECTABLE_KINDS = {
  METHOD: '__DAZE_INJECT_ABLE_KIND_METHOD__',
  PROPERTY: '__DAZE_INJECT_ABLE_KIND_PROPERTY__',
  CONSTRUCTOR: '__DAZE_INJECT_ABLE_KIND_CONSTRUCTOR__',
};
