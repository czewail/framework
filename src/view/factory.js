const Container = require('../container');

class Factory {
  app = Container.get('app');

  constructor(view) {
    this.view = view;
  }

  combineVars(request) {
    // const session = Container.get('session', [ctx]);
    // const token = ctx._csrf;
    const defaultVars = {
      session(key) {
        return request.session().get(key);
      },
      // token() {
      //   return `<input type="hidden" name="_token" value="${token}" />`;
      // },
      // old(name, defValue = '') {
      //   const oldInput = request.session().getOldInput();
      //   if (!name) return oldInput;
      //   return oldInput && oldInput[name] ? oldInput[name] : defValue;
      // },
    };
    return Object.assign({}, defaultVars, this.view.getVars());
  }

  output(request) {
    const template = this.app.get('templateEngine');
    const vars = this.combineVars(request);
    return template.render(this.view.getTemplate(), vars);
  }
}

module.exports = Factory;
