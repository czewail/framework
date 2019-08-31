/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

module.exports = function (validatorMethod, args = [], options = {}) {
  return function (target, name, descriptor) {
    const rules = Reflect.getMetadata('rules', target) || [];
    rules.push({
      field: name,
      handler: validatorMethod,
      args,
      options,
    });
    Reflect.setMetadata('rules', rules, target);
    return descriptor;
  };
};
