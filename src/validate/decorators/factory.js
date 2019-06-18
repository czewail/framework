
const validatorRulesFactory = require('../factory/validator-rules');

module.exports = function (validatorMethod, args = [], options = {}) {
  return function (elementDescriptor) {
    return {
      ...elementDescriptor,
      finisher(target) {
        const rules = Reflect.getMetadata('rules', target.prototype) || [];
        const validatorRules = validatorRulesFactory(
          elementDescriptor.key,
          validatorMethod,
          args,
          options,
        );
        rules.push(validatorRules);
        Reflect.setMetadata('rules', rules, target.prototype);
        return target;
      },
    };
  };
};
