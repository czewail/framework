/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const is = require('core-util-is');
const Container = require('../container');
const IllegalArgumentError = require('../errors/illegal-argument-error');

class Component {
  /**
   * Create Controller Module
   */
  constructor() {
    /**
     * @var {object} app Application
     */
    this.app = Container.get('app');
  }

  /**
   * register a component
   * @param {Class} component
   * @public
   */
  register(component) {
    if (!is.isFunction(component)) throw new IllegalArgumentError('component must be a class!');
    this.parseComponent(component);
    return this;
  }

  /**
   * parse a component class
   * @param {*} component
   * @private
   */
  parseComponent(component) {
    const type = Reflect.getMetadata('type', component.prototype);
    if (!['service', 'resource', 'validator', 'component'].includes(type)) throw new IllegalArgumentError('component must be use @Service or @Resource or @Component!');
    this.resolve(component, type);
    return this;
  }

  /**
   * resolve a component
   * @param {Class} component
   * @param {String} type service | resource | component
   * @private
   */
  resolve(component, type) {
    const componentName = Reflect.getMetadata(type, component.prototype) || component.name;
    if (!componentName) throw new IllegalArgumentError(`${type} must have a name!`);
    const key = `${type}.${componentName}`;
    if (!this.app.has(key)) {
      this.app.bind(key, component);
    }
    return this;
  }
}

module.exports = Component;
