
module.exports = function (validatorMethod, args = [], options = {}) {
  return function (elementDescriptor) {
    return {
      ...elementDescriptor,
      finisher(target) {
        const rules = Reflect.getMetadata('rules', target.prototype) || [];
        rules.push({
          field: elementDescriptor.key,
          handler: validatorMethod,
          args,
          options,
        });
        Reflect.setMetadata('rules', rules, target.prototype);
        return target;
      },
    };
  };
};
