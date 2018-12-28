const Decorators = require('../../src/decorators')
const { MIDDLEWARES } = require('../../src/symbol')
const { createController } = require('../helpers/utils')

describe('Decorators.MULTITON', () => {
  it('Decorators#MULTITON', () => {
    const Controller = createController()
    const mid = () => {}
    Decorators.Middleware(mid)(Controller)
    expect(Controller.prototype[MIDDLEWARES]).toContain(mid)
  })
})
