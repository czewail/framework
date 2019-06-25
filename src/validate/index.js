/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const is = require('core-util-is');
const Message = require('../foundation/support/message');
const validators = require('./validators');
const Container = require('../container');

class Validate {
  /**
   * Create Validate instance
   * @param {Object} data
   * @param {Object | String} rules
   */
  constructor(data, rules = {}) {
    /**
     * @var {Application} app Application instance
     */
    this.app = Container.get('app');

    /**
     * @var {Object} data validate data
     */
    this.data = this.parseData(data);

    /**
     * @var {Array} rules validator rules
     */
    this.rules = this.parseRules(rules);

    /**
     * @var {Message} message message instance
     */
    this.message = new Message();
  }

  /**
   * parse different type rulse
   * @param {Object | String} rules rules
   */
  parseRules(rules) {
    // if object type
    if (is.isObject(rules)) {
      // if @Validator rules
      if (Reflect.getMetadata('type', rules) === 'validator') {
        return Reflect.getMetadata('rules', rules) || [];
      }
      // independence object rules
      return this.parseIndependenceRules(rules);
    }
    // if string type
    if (is.isString(rules)) {
      const containerKey = `validator.${rules}`;
      if (!this.app.has(containerKey)) return [];
      return Reflect.getMetadata('rules', this.app.get(`validator.${rules}`)) || [];
    }
    return [];
  }

  /**
   * parse independence object rules
   * @param {Object} rules rules
   */
  parseIndependenceRules(rules) {
    const res = [];
    const fields = Object.keys(rules);
    for (const field of fields) {
      const fieldRules = rules[field];
      for (const rule of fieldRules) {
        res.push({
          field,
          handler: validators[rule[0]],
          args: rule[1],
          options: rule[2],
        });
      }
    }
    return res;
  }

  /**
   * parse validate data
   * @param {Object} data data
   */
  parseData(data = {}) {
    return data;
  }

  /**
   * generate a display message
   * @param {String} message message
   * @param {String} field field
   * @param {Array} args validate args
   */
  generateMessage(message, field, args) {
    if (!message) return undefined;
    let msg = message;
    for (const [index, val] of args.entries()) {
      msg = msg.replace(`$${index + 1}`, val);
    }
    return msg.replace('$field', field);
  }

  /**
   * validate a field
   * @param {Object} rule rule
   */
  validateField(rule) {
    if (!rule) return;
    const {
      field, args, handler, options,
    } = rule;
    const msg = options.message;
    const property = this.data[field];
    try {
      const validated = handler(property, ...args);
      if (is.isFunction(validated)) {
        if (!validated(this)) this.message.add(field, this.generateMessage(msg, field, args));
      } else if (!validated) this.message.add(field, this.generateMessage(msg, field, args));
    } catch (err) {
      this.message.add(field, this.generateMessage(msg, field, args));
    }
  }

  /**
   * check if validate data is passed
   */
  get passes() {
    for (const rule of this.rules) {
      this.validateField(rule);
    }
    return this.message.isEmpty();
  }

  /**
   * check if validate data is failed
   */
  get fails() {
    return !this.passes;
  }

  /**
   * get validate errors
   */
  get errors() {
    return this.message.messages;
  }
}

module.exports = Validate;
