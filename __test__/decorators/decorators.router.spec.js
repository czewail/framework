const Decorators = require('../../src/decorators')
const { ISROUTE, PREFIX } = require('../../src/symbol')
const { createController } = require('../helpers/utils')

describe('Decorators.Router', () => {
  it('Decorators#Router', () => {
    const Controller = createController()
    Decorators.Router()(Controller)
    expect(Controller.prototype[ISROUTE]).toBeTruthy()
    expect(Controller.prototype[PREFIX]).toBe('')
  })

  it('Decorators#Router prefix', () => {
    const Controller = createController()
    Decorators.Router('/prefix')(Controller)
    expect(Controller.prototype[PREFIX]).toBe('/prefix')
  })
})
