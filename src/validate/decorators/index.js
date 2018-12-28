const coreUtil = require('core-util-is')
const Validators = require('../lib')
const validatorFactory = require('./factory')

exports.Accepted = function (...params) {
  const [options = {}] = params
  return validatorFactory(Validators.accepted, [], options)
}

exports.Required = function (...params) {
  const [options = {}] = params
  return validatorFactory(Validators.required, [], options)
}

exports.Email = function (...params) {
  const [ignore_whitespace = false, options = {}] = params
  if (coreUtil.isObject(ignore_whitespace)) {
    return validatorFactory(Validators.email, [ignore_whitespace.ignore_whitespace || false], ignore_whitespace)
  }
  return validatorFactory(Validators.email, [ignore_whitespace], options)
}

exports.Mobile = function (...params) {
  const [locale = 'zh-CN', options = {}] = params
  if (coreUtil.isObject(locale)) {
    return validatorFactory(Validators.mobile, [locale.locale || 'zh-CN'], locale)
  }
  return validatorFactory(Validators.mobile, [locale], options)
}

exports.Alpha = function (...params) {
  const [locale = 'en-US', options = {}] = params
  if (coreUtil.isObject(locale)) {
    return validatorFactory(Validators.alpha, [locale.locale || 'en-US'], locale)
  }
  return validatorFactory(Validators.alpha, [locale], options)
}

exports.Alphanumeric = function (...params) {
  const [locale = 'en-US', options = {}] = params
  if (coreUtil.isObject(locale)) {
    return validatorFactory(Validators.alphanumeric, [locale.locale || 'en-US'], locale)
  }
  return validatorFactory(Validators.alphanumeric, [locale], options)
}

exports.IP = function (...params) {
  const [version = '', options = {}] = params
  if (coreUtil.isObject(version)) {
    // version = options
    return validatorFactory(Validators.ip, [version.version], version)
  }
  return validatorFactory(Validators.ip, [version], options)
}

exports.Equals = function (...params) {
  const [comparison, options = {}] = params
  return validatorFactory(Validators.equals, [comparison], options)
}

exports.Contains = function (...params) {
  const [seed, options = {}] = params
  return validatorFactory(Validators.contains, [seed], options)
}

exports.Confirm = function (...params) {
  const [comparisonField, options = {}] = params
  return validatorFactory(Validators.confirm, [comparisonField], options)
}

exports.NotEmpty = function (...params) {
  const [options = {}] = params
  return validatorFactory(Validators.notEmpty, [], options)
}

exports.Length = function (...params) {
  const [min, max, options = {}] = params
  if (coreUtil.isObject(max)) {
    return validatorFactory(Validators.length, [{
      min,
    }], max, [min])
  }
  return validatorFactory(Validators.length, [min, max], options)
}

exports.MinLength = function (...params) {
  const [min, options = {}] = params
  return validatorFactory(Validators.minLength, [min], options)
}

exports.MaxLength = function (...params) {
  const [max, options = {}] = params
  return validatorFactory(Validators.maxLength, [max], options)
}
