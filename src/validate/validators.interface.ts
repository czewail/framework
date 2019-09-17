

export interface IValidators {
  passed: (value: any, callback: any) => boolean,

// MARK: Common

  accepted: (value: any) => boolean,

  is: (value: any, comparison: any) => boolean,

  required: (value: any) => boolean,

  equals: (value: any, comparison: any) => boolean,

  notEquals: (value: any, comparison: any) => boolean,

  isEmpty: (value: any) => boolean,

  isNotEmpty: (value: any) => boolean,


// MARK: Number

  isDivisibleBy: (value: any, num: any) => boolean,

  isPositive: (value: any) => boolean,

  isNegative: (value: any) => boolean,

  min: (value: any, min: any) => boolean,

  max: (value: any, max: any) => boolean,

// MARK: Date

  afterDate: (value: any, date: any) => boolean,

  beforeDate: (value: any, date: any) => boolean,

// MARK: Type

  isBoolean: (value: any) => boolean,

  isDate: (value: any) => boolean,

  isString: (value: any) => boolean,

  isNumber: (value: any) => boolean,

  isArray: (value: any) => boolean,

  isError: (value: any) => boolean,

  isFunction: (value: any) => boolean,

  isBuffer: (value: any) => boolean,

  isObject: (value: any) => boolean,

  isRegExp: (value: any) => boolean,

  isSymbol: (value: any) => boolean,

  isNullOrUndefined: (value: any) => boolean,

  isNull: (value: any) => boolean,

  isUndefined: (value: any) => boolean,

// MARK: String Type

  isDateString: (value: any) => boolean,

  isBooleanString: (value: any) => boolean,

  isNumberString: (value: any, options: any) => boolean,

// MARK: String

  contains: (value: any, seed: any) => boolean,

  notContains: (value: any, seed: any) => boolean,

  isAlpha: (value: any, locale?: any) => boolean,

  isAlphanumeric: (value: any, locale?: any) => boolean,

  isAscii: (value: any) => boolean,

  isBase64: (value: any) => boolean,

  isByteLength: (value: any, min: any, max: any) => boolean,

  isCreditCard: (value: any) => boolean,

  isCurrency: (value: any, options?: any) => boolean,

  isEmail: (value: any, options?: any) => boolean,

  isFQDN: (value: any, options?: any) => boolean,

  isFullWidth: (value: any) => boolean,

  isHalfWidth: (value: any) => boolean,

  isHexColor: (value: any) => boolean,

  isHexadecimal: (value: any) => boolean,

  isIP: (value: any, version?: any) => boolean,

  isISBN: (value: any, version?: any) => boolean,

  isISSN: (value: any, options?: any) => boolean,

  isISIN: (value: any) => boolean,

  isISO8601: (value: any) => boolean,

  isJSON: (value: any) => boolean,

  isLowercase: (value: any) => boolean,

  isMobilePhone: (value: any, locale?: any, options?: any) => boolean,

  isMongoId: (value: any) => boolean,

  isMultibyte: (value: any) => boolean,

  isSurrogatePair: (value: any) => boolean,

  isURL: (value: any, options?: any) => boolean,

  isUUID: (value: any, version?: any) => boolean,

  isUppercase: (value: any) => boolean,

  length: (value: any, min: any, max: any) => boolean,

  minLength: (value: any, min: any) => boolean,

  maxLength: (value: any, max: any) => boolean,

  matches: (value: any, pattern: any, modifiers?: any) => boolean,
}
