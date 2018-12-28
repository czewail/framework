
const validatorRulesFactory = require('../factory/validator-rules')

module.exports = function (validatorMethod, args = [], options = {}) {
  return function (target, key, descriptor) {
    if (!target.__DAZE_VALIDATOR_RULES__) target.__DAZE_VALIDATOR_RULES__ = []
    const validatorRules = validatorRulesFactory(key, validatorMethod, args, options)
    target.__DAZE_VALIDATOR_RULES__.push(validatorRules)
    return descriptor
  }
}
