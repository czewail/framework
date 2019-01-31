/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const path = require('path')
const is = require('is-type-of')
const Container = require('../container')

const FINAL_VARS = Symbol('View#finalVars')

class View {
  vars = {};

  template = '';

  constructor(template = '', vars = {}) {
    this.app = Container.get('app')
    this.render(template, vars)
  }

  /**
   * Generate template variables
   */
  [FINAL_VARS](vars = {}) {
    return Object.assign({}, this.vars, vars)
  }

  /**
   * Pass the variable to the template
   * @param {string|object} name variable object or variable name
   * @param {mixed} value variable value
   */
  assign(name, value) {
    if (is.object(name)) {
      this.vars = Object.assign(this.vars, name)
    } else if (typeof name === 'string') {
      this.vars[name] = value
    }
    return this
  }

  /**
   * render the template
   * @param {string} template template path and name
   * @param {object} vars template variables
   */
  render(template = '', vars = null) {
    // When parsing the controller, return it if you take this parameter
    // 解析控制器时，如果带此参数则直接 return 出去
    if (is.object(template)) {
      vars = template
      template = null
    }
    if (template) this.template = template
    if (vars) this.vars = this[FINAL_VARS](vars)
    return this
  }

  /**
   * getTemplate
   */
  getTemplate() {
    const config = this.app.get('config')
    const ext = config.get('app.view_extension')
    if (path.extname(this.template) === '') {
      return `${this.template}.${ext}`
    }
    return this.template
  }

  /**
   * getVars
   */
  getVars() {
    return this.vars
  }
}

module.exports = View
