const Decorators = require('../../src/decorators')
const { MULTITON } = require('../../src/symbol')
const { createController } = require('../helpers/utils')

describe('Decorators.MULTITON', () => {
  it('Decorators#MULTITON', () => {
    const Controller = createController()
    Decorators.Multiton()(Controller)
    expect(Controller[MULTITON]).toBeTruthy()
  })
})
