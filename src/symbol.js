/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// 容器实例多例标识
exports.MULTITON = Symbol('DAZE#multiton');

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
