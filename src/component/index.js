const path = require('path');
const glob = require('glob');
const is = require('core-util-is');
const Metadata = require('../foundation/support/metadata');

const PREFIX = '__DAZE_CONTAINER_COMPONENT_';

class Component {
  constructor() {
    this.components = [];
  }

  register(component) {
    if (is.isString(component)) {
      this.parseStringComponent(component);
    } else if (is.isFunction(component)) {
      this.parseFunctionComponent(component);
    }
  }

  parseStringComponent(component) {
    if (!is.isString(component)) return this;
    const klawComponents = glob.sync(path.resolve(this.app.appPath, component), {
      nodir: true,
    });
    for (const _component of klawComponents) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const _Component = require(_component);
      this.parseFunctionComponent(_Component);
    }
    return this;
  }

  parseFunctionComponent(component) {
    if (!is.isFunction(component)) return this;
    if (!Metadata.get('isComponent', component.prototype)) return this;
    const componentSign = Metadata.get('component', component.prototype) || {};
    if (!componentSign.name) return this;
    const containerKey = `${PREFIX}${componentSign.name}`;
    if (!this.app.has(containerKey)) {
      this.app.bind(containerKey, component);
      this.components.push(containerKey);
    }
    return this;
  }
}

module.exports = Component;
