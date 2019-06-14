const is = require('core-util-is');
const Container = require('../container');

class Component {
  constructor() {
    this.app = Container.get('app');
  }

  register(component) {
    if (!is.isFunction(component)) return this;
    this.parseComponent(component);
    return this;
  }

  parseComponent(component) {
    const type = Reflect.getMetadata('type', component.prototype);
    this.registerComponent(component, type);
    return this;
  }

  registerComponent(component, type) {
    const componentName = Reflect.getMetadata(type, component.prototype) || component.name;
    const key = `${type}.${componentName}`;
    if (!this.app.has(key)) {
      this.app.bind(key, component);
    }
    return this;
  }
}

module.exports = Component;
