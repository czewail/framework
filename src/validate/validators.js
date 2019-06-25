/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const validator = require('validator');
const isType = require('core-util-is');

// MARK: Custom

exports.passed = function (value, callback) {
  return isType.isFunction(callback) && !!callback(value);
};

// MARK: Common

exports.accepted = function (value) {
  return ['yes', 'on', true, 'true', 1, '1'].includes(value);
};

exports.is = function (value, comparison) {
  return Object.is(value, comparison);
};

exports.required = function (value) {
  return value !== undefined;
};

exports.equals = function (value, comparison) {
  return value === comparison;
};

exports.notEquals = function (value, comparison) {
  return !exports.equals(value, comparison);
};

exports.isEmpty = function (value) {
  return value === '' || value === null || value === undefined;
};

exports.isNotEmpty = function (value) {
  return !exports.isEmpty(value);
};


// MARK: Number

exports.isDivisibleBy = function (value, num) {
  return validator.isDivisibleBy(String(value), num);
};

exports.isPositive = function (value) {
  return value > 0;
};

exports.isNegative = function (value) {
  return value < 0;
};

exports.min = function (value, min) {
  return value >= min;
};

exports.max = function (value, max) {
  return value <= max;
};

// MARK: Date

exports.afterDate = function (value, date) {
  return value && value.getTime() >= date.getTime();
};

exports.beforeDate = function (value, date) {
  return value && value.getTime() <= date.getTime();
};

// MARK: Type

exports.isBoolean = function (value) {
  return isType.isBoolean(value);
};

exports.isDate = function (value) {
  return isType.isDate(value);
};

exports.isString = function (value) {
  return isType.isString(value);
};

exports.isNumber = function (value) {
  return isType.isNumber(value);
};

exports.isArray = function (value) {
  return isType.isArray(value);
};

exports.isError = function (value) {
  return isType.isError(value);
};

exports.isFunction = function (value) {
  return isType.isFunction(value);
};

exports.isBuffer = function (value) {
  return isType.isBuffer(value);
};

exports.isObject = function (value) {
  return isType.isObject(value);
};

exports.isRegExp = function (value) {
  return isType.isRegExp(value);
};

exports.isSymbol = function (value) {
  return isType.isSymbol(value);
};

exports.isNullOrUndefined = function (value) {
  return isType.isNullOrUndefined(value);
};

exports.isNull = function (value) {
  return isType.isNull(value);
};

exports.isUndefined = function (value) {
  return isType.isUndefined(value);
};

// MARK: String Type

exports.isDateString = function (value) {
  const date = Date.parse(value);
  return isType.isString(value) && !Number.isNaN(date);
};

exports.isBooleanString = function (value) {
  return isType.isString(value) && validator.isBoolean(value);
};

exports.isNumberString = function (value, options) {
  return isType.isString(value) && validator.isNumeric(value, options);
};

// MARK: String

exports.contains = function (value, seed) {
  return validator.contains(value, seed);
};

exports.notContains = function (value, seed) {
  return !exports.contains(value, seed);
};

exports.isAlpha = function (value, locale) {
  return validator.isAlpha(value, locale);
};

exports.isAlphanumeric = function (value, locale) {
  return validator.isAlphanumeric(value, locale);
};

exports.isAscii = function (value) {
  return validator.isAscii(value);
};

exports.isBase32 = function (value) {
  return validator.isBase32(value);
};

exports.isBase64 = function (value) {
  return validator.isBase64(value);
};

exports.isByteLength = function (value, min, max) {
  return validator.isByteLength(value, { min, max });
};

exports.isCreditCard = function (value) {
  return validator.isCreditCard(value);
};

exports.isCurrency = function (value, options) {
  return validator.isCurrency(value, options);
};

exports.isEmail = function (value, options) {
  return validator.isEmail(value, options);
};

exports.isFQDN = function (value, options) {
  return validator.isFQDN(value, options);
};

exports.isFullWidth = function (value) {
  return validator.isFullWidth(value);
};

exports.isHalfWidth = function (value) {
  return validator.isHalfWidth(value);
};

exports.isHexColor = function (value) {
  return validator.isHexColor(value);
};

exports.isHexadecimal = function (value) {
  return validator.isHexadecimal(value);
};

exports.isIP = function (value, version) {
  return validator.isIP(value, version);
};

exports.isISBN = function (value, version) {
  return validator.isISBN(value, version);
};

exports.isISSN = function (value, options) {
  return validator.isISSN(value, options);
};

exports.isISIN = function (value) {
  return validator.isISIN(value);
};

exports.isISO8601 = function (value) {
  return validator.isISO8601(value);
};

exports.isJSON = function (value) {
  return validator.isJSON(value);
};

exports.isLowercase = function (value) {
  return validator.isLowercase(value);
};

exports.isMobilePhone = function (value, locale, options) {
  return validator.isMobilePhone(value, locale, options);
};

exports.isMongoId = function (value) {
  return validator.isMongoId(value);
};

exports.isMultibyte = function (value) {
  return validator.isMultibyte(value);
};

exports.isSurrogatePair = function (value) {
  return validator.isSurrogatePair(value);
};

exports.isURL = function (value, options) {
  return validator.isURL(value, options);
};

exports.isUUID = function (value, version) {
  return validator.isUUID(value, version);
};

exports.isUppercase = function (value) {
  return validator.isUppercase(value);
};

exports.length = function (value, min, max) {
  return validator.isLength(value, { min, max });
};

exports.minLength = function (value, min) {
  return validator.isLength(value, { min });
};

exports.maxLength = function (value, max) {
  return validator.isLength(value, { max });
};

exports.matches = function (value, pattern, modifiers) {
  return validator.matches(value, pattern, modifiers);
};
