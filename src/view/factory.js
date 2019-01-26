const Container = require('../container')

class Factory {
  app = Container.get('app');

  constructor(view) {
    this.view = view
  }

  combineVars(ctx) {
    const session = Container.get('session', [ctx])
    const token = ctx._csrf
    const defaultVars = {
      get session() {
        return session
      },
      get __token__() {
        return token
      },
      get errors() {
        return session.getErrors()
      },
      token() {
        return `<input type="hidden" name="_token" value="${token}" />`
      },
      old(name, defValue = '') {
        const oldInput = session.getOldInput()
        if (!name) return oldInput
        return oldInput && oldInput[name] ? oldInput[name] : defValue
      }
    }
    return Object.assign({}, defaultVars, this.view.getVars())
  }

  output(ctx) {
    const template = this.app.get('template')
    const vars = this.combineVars(ctx)
    return template.render(this.view.getTemplate(), vars)
  }
}

module.exports = Factory
