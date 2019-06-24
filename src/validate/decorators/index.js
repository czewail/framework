const is = require('core-util-is');
const validatorFactory = require('./factory');
const validators = require('../validators');

// MARK: Custom

exports.Passed = function (options) {
  return validatorFactory(validators.passed, 'passed', [], options);
};

// MARK: Common

exports.Accepted = function (options) {
  return validatorFactory(validators.accepted, 'accepted', [], options);
};

exports.Is = function (comparison, options) {
  return validatorFactory(validators.is, 'is', [comparison], options);
};

exports.Required = function (options) {
  return validatorFactory(validators.required, 'required', [], options);
};

exports.Equals = function (comparison, options) {
  return validatorFactory(validators.equals, 'equals', [comparison], options);
};

exports.NotEquals = function (comparison, options) {
  return validatorFactory(validators.notEquals, 'notEquals', [comparison], options);
};

exports.IsEmpty = function (options) {
  return validatorFactory(validators.isEmpty, 'isEmpty', [], options);
};

exports.IsNotEmpty = function (options) {
  return validatorFactory(validators.isNotEmpty, 'isNotEmpty', [], options);
};

// MARK: Number

exports.IsDivisibleBy = function (num, options) {
  return validatorFactory(validators.isDivisibleBy, 'isDivisibleBy', [num], options);
};

exports.IsPositive = function (options) {
  return validatorFactory(validators.isPositive, 'isPositive', [], options);
};

exports.IsNegative = function (options) {
  return validatorFactory(validators.isNegative, 'isNegative', [], options);
};

exports.Min = function (min, options) {
  return validatorFactory(validators.min, 'min', [min], options);
};

exports.Max = function (max, options) {
  return validatorFactory(validators.max, 'max', [max], options);
};


// MARK: Date

exports.MinDate = function (min, options) {
  return validatorFactory(validators.minDate, 'minDate', [min], options);
};

exports.MaxDate = function (max, options) {
  return validatorFactory(validators.maxDate, 'maxDate', [max], options);
};

// MARK: Type

exports.IsBoolean = function (options) {
  return validatorFactory(validators.isBoolean, 'isBoolean', [], options);
};

exports.IsDate = function (options) {
  return validatorFactory(validators.isDate, 'isDate', [], options);
};

exports.IsString = function (options) {
  return validatorFactory(validators.isString, 'isString', [], options);
};

exports.IsNumber = function (options) {
  return validatorFactory(validators.isNumber, 'isNumber', [], options);
};

exports.IsArray = function (options) {
  return validatorFactory(validators.isArray, 'isArray', [], options);
};

exports.IsError = function (options) {
  return validatorFactory(validators.isError, 'isError', [], options);
};

exports.IsFunction = function (options) {
  return validatorFactory(validators.isFunction, 'isFunction', [], options);
};

exports.IsPrimitive = function (options) {
  return validatorFactory(validators.isPrimitive, 'isPrimitive', [], options);
};

exports.IsBuffer = function (options) {
  return validatorFactory(validators.isBuffer, 'isBuffer', [], options);
};

exports.IsObject = function (options) {
  return validatorFactory(validators.isObject, 'isObject', [], options);
};

exports.IsRegExp = function (options) {
  return validatorFactory(validators.isRegExp, 'isRegExp', [], options);
};

exports.IsSymbol = function (options) {
  return validatorFactory(validators.isSymbol, 'isSymbol', [], options);
};

exports.IsNullOrUndefined = function (options) {
  return validatorFactory(validators.isNullOrUndefined, 'isNullOrUndefined', [], options);
};

exports.IsNull = function (options) {
  return validatorFactory(validators.isNull, 'isNull', [], options);
};

exports.IsUndefined = function (options) {
  return validatorFactory(validators.isUndefined, 'isUndefined', [], options);
};

// MARK: String Type

exports.IsDateString = function (options) {
  return validatorFactory(validators.isDateString, 'isDateString', [], options);
};

exports.IsBooleanString = function (options) {
  return validatorFactory(validators.isBooleanString, 'isBooleanString', [], options);
};

exports.IsNumberString = function (options) {
  return validatorFactory(validators.isNumberString, 'isNumberString', [options], options);
};


// MARK: String

exports.Contains = function (seed, options) {
  return validatorFactory(validators.contains, 'contains', [seed], options);
};

exports.NotContains = function (seed, options) {
  return validatorFactory(validators.notContains, 'notContains', [seed], options);
};

exports.IsAlpha = function (locale, options) {
  if (is.isObject(locale)) {
    return validatorFactory(validators.isAlpha, 'isAlpha', [locale.locale], locale);
  }
  return validatorFactory(validators.isAlpha, 'isAlpha', [locale], options);
};

exports.IsAlphanumeric = function (locale, options) {
  if (is.isObject(locale)) {
    return validatorFactory(validators.isAlphanumeric, 'isAlphanumeric', [locale.locale], locale);
  }
  return validatorFactory(validators.isAlphanumeric, 'isAlphanumeric', [locale], options);
};

exports.IsAscii = function (options) {
  return validatorFactory(validators.isAscii, 'isAscii', [], options);
};

exports.IsBase32 = function (options) {
  return validatorFactory(validators.isBase32, 'isBase32', [], options);
};

exports.IsBase64 = function (options) {
  return validatorFactory(validators.isBase64, 'isBase64', [], options);
};

exports.IsByteLength = function (min, max, options) {
  return validatorFactory(validators.isByteLength, 'isByteLength', [min, max], options);
};

exports.IsCreditCard = function (options) {
  return validatorFactory(validators.isCreditCard, 'isCreditCard', [], options);
};

exports.IsCurrency = function (options) {
  return validatorFactory(validators.isCurrency, 'isCurrency', [options], options);
};

exports.IsEmail = function (options) {
  return validatorFactory(validators.isEmail, 'isEmail', [options], options);
};

exports.IsFQDN = function (options) {
  return validatorFactory(validators.isFQDN, 'isFQDN', [options], options);
};

exports.IsFullWidth = function (options) {
  return validatorFactory(validators.isFullWidth, 'isFullWidth', [], options);
};

exports.IsHalfWidth = function (options) {
  return validatorFactory(validators.isHalfWidth, 'isHalfWidth', [], options);
};

exports.IsHexColor = function (options) {
  return validatorFactory(validators.isHexColor, 'isHexColor', [], options);
};

exports.IsHexadecimal = function (options) {
  return validatorFactory(validators.isHexadecimal, 'isHexadecimal', [], options);
};

exports.IsIP = function (version, options) {
  if (is.isObject(version)) {
    return validatorFactory(validators.isIP, 'isIP', [version.version], version);
  }
  return validatorFactory(validators.isIP, 'isIP', [version], options);
};

exports.IsISBN = function (version, options) {
  if (is.isObject(version)) {
    return validatorFactory(validators.isISBN, 'isISBN', [version.version], version);
  }
  return validatorFactory(validators.isISBN, 'isISBN', [version], options);
};

exports.IsISSN = function (options) {
  return validatorFactory(validators.isISSN, 'isISSN', [options], options);
};

exports.IsISIN = function (options) {
  return validatorFactory(validators.isISIN, 'isISIN', [], options);
};

exports.IsISO8601 = function (options) {
  return validatorFactory(validators.isISO8601, 'isISO8601', [], options);
};

exports.IsJSON = function (options) {
  return validatorFactory(validators.isJSON, 'isJSON', [], options);
};

exports.IsLowercase = function (options) {
  return validatorFactory(validators.isLowercase, 'isLowercase', [], options);
};

exports.IsMobilePhone = function (locale, options) {
  if (is.isObject(locale)) {
    return validatorFactory(validators.isMobilePhone, 'isMobilePhone', [locale.locale, locale], locale);
  }
  return validatorFactory(validators.isMobilePhone, 'isMobilePhone', [locale, options], options);
};

exports.IsMongoId = function (options) {
  return validatorFactory(validators.isMongoId, 'isMongoId', [], options);
};

exports.IsMultibyte = function (options) {
  return validatorFactory(validators.isMultibyte, 'isMultibyte', [], options);
};

exports.IsSurrogatePair = function (options) {
  return validatorFactory(validators.isSurrogatePair, 'isSurrogatePair', [], options);
};

exports.IsURL = function (options) {
  return validatorFactory(validators.isURL, 'isURL', [options], options);
};

exports.IsUUID = function (version, options) {
  if (is.isObject(version)) {
    return validatorFactory(validators.isUUID, 'isUUID', [version.version], version);
  }
  return validatorFactory(validators.isUUID, 'isUUID', [version], options);
};

exports.IsUppercase = function (options) {
  return validatorFactory(validators.isUppercase, 'isUppercase', [], options);
};

exports.Length = function (min, max, options) {
  return validatorFactory(validators.length, 'length', [min, max], options);
};

exports.MinLength = function (min, options) {
  return validatorFactory(validators.minLength, 'minLength', [min], options);
};

exports.MaxLength = function (max, options) {
  return validatorFactory(validators.maxLength, 'maxLength', [max], options);
};

exports.Matches = function (pattern, modifiers, options) {
  if (is.isObject(modifiers)) {
    return validatorFactory(
      validators.matches,
      'matches',
      [pattern, modifiers.modifiers, modifiers],
      modifiers,
    );
  }
  return validatorFactory(validators.matches, 'matches', [pattern, modifiers, options], options);
};
