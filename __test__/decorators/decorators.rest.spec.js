const Decorators = require('../../src/decorators')
const { ROUTES } = require('../../src/symbol')
const { createController } = require('../helpers/utils')

const rest = {
  index: { uri: '/', method: 'get' },
  create: { uri: '/create', method: 'get' },
  show: { uri: '/:id', method: 'get' },
  store: { uri: '/', method: 'post' },
  edit: { uri: '/:id/edit', method: 'get' },
  update: { uri: '/:id', method: 'put' },
  destroy: { uri: '/:id', method: 'del' },
}

describe('Decorators.Rest', () => {
  it('Decorators#Rest', () => {
    const Controller = createController()
    Decorators.Rest()(Controller)
    expect(Controller.prototype[ROUTES]).toEqual(rest)
    Decorators.Get()(Controller.prototype, 'index', Object.getOwnPropertyDescriptor(Controller.prototype, 'index'))
    expect(Controller.prototype[ROUTES]).toEqual(rest)
  })

  it('Decorators#Rest cover', () => {
    const Controller = createController()
    Decorators.Get()(Controller.prototype, 'index', Object.getOwnPropertyDescriptor(Controller.prototype, 'index'))
    Decorators.Rest()(Controller)
    expect(Controller.prototype[ROUTES]).toEqual(rest)
  })
})
