const coreUtil = require('core-util-is');
const path = require('path');
const Message = require('../foundation/support/message');
const Container = require('../container');
const libs = require('./lib');
const validatorRulesFactory = require('./factory/validator-rules');

class Validate {
  constructor(data, rules = {}) {
    this.app = Container.get('app');
    this.data = this.parseData(data);
    this.rules = this.parseRules(rules);
    this.messages = new Message();
    this.typeMessages = {
      accepted: '$field must be yes,on or 1',
      required: '$field require',
      email: '$field not a valid email address',
      mobile: '$field not a valid mobile',
      alpha: '$field must be alpha',
      alphanumeric: '$field must be alpha-numeric',
      ip: '$field not a valid ip',
      equals: '$field must equal $1',
      contains: '$field must contain $1',
      confirm: '$field out of accord with $1',
      notEmpty: '$field must not be empty',
      length: 'size of $field must be $1 - $2',
      minLength: 'min size of $field must be $1',
      maxLength: 'max size of $field must be $1',
    };
  }

  getRulesPath(rulesName) {
    if (rulesName.slice(-3) === '.js') return rulesName;
    return `${rulesName}.js`;
  }

  parseRules(rules) {
    if (coreUtil.isObject(rules)) {
      if (rules.__DAZE_VALIDATOR_RULES__) {
        return rules.__DAZE_VALIDATOR_RULES__;
      }
      return this.parseRulesIndependence(rules);
    } if (coreUtil.isString(rules)) {
      const rulesPath = path.resolve(this.app.validatePath, this.getRulesPath(rules));
      const rulesInstance = this.app.craft(rulesPath);
      if (rulesInstance.__DAZE_VALIDATOR_RULES__) {
        return rulesInstance.__DAZE_VALIDATOR_RULES__;
      }
    }
    return [];
  }

  parseRulesIndependence(rules) {
    const res = [];
    const fields = Object.keys(rules);
    for (const field of fields) {
      const fieldRules = rules[field];
      for (const rule of fieldRules) {
        const validatorRules = validatorRulesFactory(field, libs[rule[0]], rule[1], rule[2]);
        res.push(validatorRules);
      }
    }
    return res;
  }

  parseData(data) {
    return data;
  }

  parseMessage(message, field, args) {
    if (!message) return undefined;
    let msg = message;
    for (const [index, val] of args.entries()) {
      msg = msg.replace(`$${index + 1}`, val);
    }
    return msg.replace('$field', field);
  }

  validateProperty(rule) {
    if (!rule) return;
    const {
      field, name, args, handler, options,
    } = rule;
    const msg = options.message || this.typeMessages[name];
    const property = this.data[field];
    try {
      const validated = handler(property, ...args);
      if (coreUtil.isFunction(validated)) {
        if (!validated(this)) this.messages.add(field, this.parseMessage(msg, field, args));
      } else if (!validated) this.messages.add(field, this.parseMessage(msg, field, args));
    } catch (err) {
      // console.log(err)
      this.messages.add(field, this.parseMessage(msg, field, args));
    }
  }

  get passes() {
    for (const rule of this.rules) {
      this.validateProperty(rule);
    }
    return this.messages.isEmpty();
  }

  get fails() {
    return !this.passes;
  }

  get errors() {
    return this.messages;
  }
}

module.exports = Validate;
