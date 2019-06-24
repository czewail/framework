const is = require('core-util-is');
const validatorFactory = require('./factory');
const validators = require('../validators');

// MARK: Custom

exports.Passed = function (options) {
  return validatorFactory(validators.passed, [], {
    message: '$field must be passed!',
    ...options,
  });
};

// MARK: Common

exports.Accepted = function (options) {
  return validatorFactory(validators.accepted, [], {
    message: '$field must be yes,on or 1',
    ...options,
  });
};

exports.Is = function (comparison, options) {
  return validatorFactory(validators.is, [comparison], {
    message: '$field must is $1',
    ...options,
  });
};

exports.Required = function (options) {
  return validatorFactory(validators.required, [], {
    message: '$feild must not be undefined',
    ...options,
  });
};

exports.Equals = function (comparison, options) {
  return validatorFactory(validators.equals, [comparison], {
    message: '$field must be equal to $1',
    ...options,
  });
};

exports.NotEquals = function (comparison, options) {
  return validatorFactory(validators.notEquals, [comparison], {
    message: '$field shoud not equal to $1',
    ...options,
  });
};

exports.IsEmpty = function (options) {
  return validatorFactory(validators.isEmpty, [], {
    message: '$field must be empty',
    ...options,
  });
};

exports.IsNotEmpty = function (options) {
  return validatorFactory(validators.isNotEmpty, [], {
    message: '$field should not be empty',
    ...options,
  });
};

// MARK: Number

exports.IsDivisibleBy = function (num, options) {
  return validatorFactory(validators.isDivisibleBy, [num], {
    message: '$field must be divisible by $1',
    ...options,
  });
};

exports.IsPositive = function (options) {
  return validatorFactory(validators.isPositive, [], {
    message: '$field must be a positive number',
    ...options,
  });
};

exports.IsNegative = function (options) {
  return validatorFactory(validators.isNegative, [], {
    message: '$field must be a negative number',
    ...options,
  });
};

exports.Min = function (min, options) {
  return validatorFactory(validators.min, [min], {
    message: '$field must not be less than $1',
    ...options,
  });
};

exports.Max = function (max, options) {
  return validatorFactory(validators.max, [max], {
    message: '$field must not be greater than $1',
    ...options,
  });
};


// MARK: Date

exports.MinDate = function (min, options) {
  return validatorFactory(validators.minDate, [min], {
    message: '$field date must not be before than $1',
    ...options,
  });
};

exports.MaxDate = function (max, options) {
  return validatorFactory(validators.maxDate, [max], {
    message: '$field date must not be after than $1',
    ...options,
  });
};

// MARK: Type

exports.IsBoolean = function (options) {
  return validatorFactory(validators.isBoolean, [], {
    message: '$field must be a boolean value',
    ...options,
  });
};

exports.IsDate = function (options) {
  return validatorFactory(validators.isDate, [], {
    message: '$field must be a date value',
    ...options,
  });
};

exports.IsString = function (options) {
  return validatorFactory(validators.isString, [], {
    message: '$field must be a string value',
    ...options,
  });
};

exports.IsNumber = function (options) {
  return validatorFactory(validators.isNumber, [], {
    message: '$field must be a number value',
    ...options,
  });
};

exports.IsArray = function (options) {
  return validatorFactory(validators.isArray, [], {
    message: '$field must be a array value',
    ...options,
  });
};

exports.IsError = function (options) {
  return validatorFactory(validators.isError, [], {
    message: '$field must be an error',
    ...options,
  });
};

exports.IsFunction = function (options) {
  return validatorFactory(validators.isFunction, [], {
    message: '$field must be a function',
    ...options,
  });
};

exports.IsBuffer = function (options) {
  return validatorFactory(validators.isBuffer, [], {
    message: '$field must be a buffer',
    ...options,
  });
};

exports.IsObject = function (options) {
  return validatorFactory(validators.isObject, [], {
    message: '$field must be an object value',
    ...options,
  });
};

exports.IsRegExp = function (options) {
  return validatorFactory(validators.isRegExp, [], {
    message: '$field must be a regexp',
    ...options,
  });
};

exports.IsSymbol = function (options) {
  return validatorFactory(validators.isSymbol, [], {
    message: '$field must be a symbol value',
    ...options,
  });
};

exports.IsNullOrUndefined = function (options) {
  return validatorFactory(validators.isNullOrUndefined, [], {
    message: '$field must be null or undefined',
    ...options,
  });
};

exports.IsNull = function (options) {
  return validatorFactory(validators.isNull, [], {
    message: '$field must be null',
    ...options,
  });
};

exports.IsUndefined = function (options) {
  return validatorFactory(validators.isUndefined, [], {
    message: '$field must be undefined',
    ...options,
  });
};

// MARK: String Type

exports.IsDateString = function (options) {
  return validatorFactory(validators.isDateString, [], {
    message: '$field must be a date string value',
    ...options,
  });
};

exports.IsBooleanString = function (options) {
  return validatorFactory(validators.isBooleanString, [], {
    message: '$field must be a boolean string value',
    ...options,
  });
};

exports.IsNumberString = function (options) {
  return validatorFactory(validators.isNumberString, [options], {
    message: '$field must be a number string value',
    ...options,
  });
};


// MARK: String

exports.Contains = function (seed, options) {
  return validatorFactory(validators.contains, [seed], {
    message: '$field must contain a $1 string',
    ...options,
  });
};

exports.NotContains = function (seed, options) {
  return validatorFactory(validators.notContains, [seed], {
    message: '$field should not contain a $1 string',
    ...options,
  });
};

exports.IsAlpha = function (locale, options) {
  const defaultMessage = '$field must contain only letters (a-zA-Z)';
  if (is.isObject(locale)) {
    return validatorFactory(validators.isAlpha, [locale.locale], {
      message: defaultMessage,
      ...locale,
    });
  }
  return validatorFactory(validators.isAlpha, [locale], {
    message: defaultMessage,
    ...options,
  });
};

exports.IsAlphanumeric = function (locale, options) {
  const defaultMessage = '$field must contain only letters and numbers';
  if (is.isObject(locale)) {
    return validatorFactory(validators.isAlphanumeric, [locale.locale], {
      message: defaultMessage,
      ...locale,
    });
  }
  return validatorFactory(validators.isAlphanumeric, [locale], {
    message: defaultMessage,
    ...options,
  });
};

exports.IsAscii = function (options) {
  return validatorFactory(validators.isAscii, [], {
    message: '$field must contain only ASCII characters',
    ...options,
  });
};

exports.IsBase32 = function (options) {
  return validatorFactory(validators.isBase32, [], {
    message: '$field must be base32 encoded',
    ...options,
  });
};

exports.IsBase64 = function (options) {
  return validatorFactory(validators.isBase64, [], {
    message: '$field must be base64 encoded',
    ...options,
  });
};

exports.IsByteLength = function (min, max, options) {
  return validatorFactory(validators.isByteLength, [min, max], {
    message: '$field\'s byte length must fall into($1, $2) range',
    ...options,
  });
};

exports.IsCreditCard = function (options) {
  return validatorFactory(validators.isCreditCard, [], {
    message: '$field must be a credit card',
    ...options,
  });
};

exports.IsCurrency = function (options) {
  return validatorFactory(validators.isCurrency, [options], {
    message: '$field must be a currency',
    ...options,
  });
};

exports.IsEmail = function (options) {
  return validatorFactory(validators.isEmail, [options], {
    message: '$field must be an email',
    ...options,
  });
};

exports.IsFQDN = function (options) {
  return validatorFactory(validators.isFQDN, [options], {
    message: '$field must be a valid domain name',
    ...options,
  });
};

exports.IsFullWidth = function (options) {
  return validatorFactory(validators.isFullWidth, [], {
    message: '$field must contain a full-width characters',
    ...options,
  });
};

exports.IsHalfWidth = function (options) {
  return validatorFactory(validators.isHalfWidth, [], {
    message: '$field must contain a half-width characters',
    ...options,
  });
};

exports.IsHexColor = function (options) {
  return validatorFactory(validators.isHexColor, [], {
    message: '$field must be a hex color',
    ...options,
  });
};

exports.IsHexadecimal = function (options) {
  return validatorFactory(validators.isHexadecimal, [], {
    message: '$field must be a hexadecimal number',
    ...options,
  });
};

exports.IsIP = function (version, options) {
  const defaultMessage = '$field must be an ip address';
  if (is.isObject(version)) {
    return validatorFactory(validators.isIP, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isIP, [version], {
    message: defaultMessage,
    ...options,
  });
};

exports.IsISBN = function (version, options) {
  const defaultMessage = '$field must be an ISBN';
  if (is.isObject(version)) {
    return validatorFactory(validators.isISBN, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isISBN, [version], {
    message: defaultMessage,
    ...options,
  });
};

exports.IsISSN = function (options) {
  return validatorFactory(validators.isISSN, [options], {
    message: '$field must be an ISSN',
    ...options,
  });
};

exports.IsISIN = function (options) {
  return validatorFactory(validators.isISIN, [], {
    message: '$field must be an ISIN (stock/security identifier)',
    ...options,
  });
};

exports.IsISO8601 = function (options) {
  return validatorFactory(validators.isISO8601, [], {
    message: '$field must be a valid ISO 8601 date string',
    ...options,
  });
};

exports.IsJSON = function (options) {
  return validatorFactory(validators.isJSON, [], {
    message: '$field must be a json string',
    ...options,
  });
};

exports.IsLowercase = function (options) {
  return validatorFactory(validators.isLowercase, [], {
    message: '$field must be a lowercase string',
    ...options,
  });
};

exports.IsMobilePhone = function (locale, options) {
  if (is.isObject(locale)) {
    return validatorFactory(validators.isMobilePhone, [locale.locale, locale], locale);
  }
  return validatorFactory(validators.isMobilePhone, [locale, options], {
    message: '$field must be a mobile phone number',
    ...options,
  });
};

exports.IsMongoId = function (options) {
  return validatorFactory(validators.isMongoId, [], {
    message: '$field must be a mongodb id',
    ...options,
  });
};

exports.IsMultibyte = function (options) {
  return validatorFactory(validators.isMultibyte, [], {
    message: '$field must contain one or more multibyte chars',
    ...options,
  });
};

exports.IsSurrogatePair = function (options) {
  return validatorFactory(validators.isSurrogatePair, [], {
    message: '$field must contain any surrogate pairs chars',
    ...options,
  });
};

exports.IsURL = function (options) {
  return validatorFactory(validators.isURL, [options], {
    message: '$field must be an URL address',
    ...options,
  });
};

exports.IsUUID = function (version, options) {
  const defaultMessage = '$field must be an UUID';
  if (is.isObject(version)) {
    return validatorFactory(validators.isUUID, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isUUID, [version], {
    message: defaultMessage,
    ...options,
  });
};

exports.IsUppercase = function (options) {
  return validatorFactory(validators.isUppercase, [], {
    message: '$field must be an uppercase string',
    ...options,
  });
};

exports.Length = function (min, max, options) {
  return validatorFactory(validators.length, [min, max], {
    message: '$field must be between $1 and $2',
    ...options,
  });
};

exports.MinLength = function (min, options) {
  return validatorFactory(validators.minLength, [min], {
    message: '$field must not be shorter than $1',
    ...options,
  });
};

exports.MaxLength = function (max, options) {
  return validatorFactory(validators.maxLength, [max], {
    message: '$field must not be longer than $1',
    ...options,
  });
};

exports.Matches = function (pattern, modifiers, options) {
  const defaultMessage = '$field must match $1 regular expression';
  if (is.isObject(modifiers)) {
    return validatorFactory(
      validators.matches,
      'matches',
      [pattern, modifiers.modifiers, modifiers],
      {
        message: defaultMessage,
        ...modifiers,
      },
    );
  }
  return validatorFactory(validators.matches, [pattern, modifiers, options], {
    message: defaultMessage,
    ...options,
  });
};
