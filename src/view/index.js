/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const path = require('path');
const is = require('core-util-is');
const Container = require('../container');

/**
 * @class
 */
class View {
  /**
   * @private
   */
  app = Container.get('app');

  /**
   * @type {object}
   * @private
   */
  vars = {};

  /**
   * @type {string}
   * @private
   */
  template = '';

  /**
   *
   * @param {string} [template='']
   * @param {object} [vars={}]
   */
  constructor(template = '', vars = {}) {
    this.template = template;

    this.vars = vars;
  }

  /**
   * Generate template variables
   * @private
   */
  combineVars(vars = {}) {
    return {
      ...this.vars,
      ...vars,
    };
  }

  /**
   * Pass the variable to the template
   * @public
   * @param {string|object} name variable object or variable name
   * @param {*} value variable value
   */
  assign(name, value) {
    if (is.isObject(name)) {
      this.vars = Object.assign(this.vars, name);
    } else if (typeof name === 'string') {
      this.vars[name] = value;
    }
    return this;
  }

  /**
   * render the template
   * @public
   * @param {string | object} template template path and name
   * @param {object} [vars] template variables
   */
  render(template = '', vars) {
    // When parsing the controller, return it if you take this parameter
    // 解析控制器时，如果带此参数则直接 return 出去
    let newTemplate = template;
    let newVars = vars;
    if (is.isObject(newTemplate)) {
      newVars = newTemplate;
      newTemplate = null;
    }
    if (newTemplate) this.template = newTemplate;
    if (newVars) this.vars = this.combineVars(newVars);
    return this;
  }

  /**
   * getTemplate
   * @public
   */
  getTemplate() {
    const config = this.app.get('config');
    const ext = config.get('app.view_extension');
    if (path.extname(this.template) === '') {
      return `${this.template}.${ext}`;
    }
    return this.template;
  }

  /**
   * getVars
   * @public
   */
  getVars() {
    return this.vars;
  }
}

module.exports = View;
