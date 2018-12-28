const Decorators = require('../../src/decorators')
const { HTTP_CODE } = require('../../src/symbol')
const { createController } = require('../helpers/utils')

describe('Decorators.HttpCode', () => {
  it('Decorators#HttpCode', () => {
    const Controller = createController()
    Decorators.HttpCode(201)(Controller.prototype, 'index', Object.getOwnPropertyDescriptor(Controller.prototype, 'index'))
    expect(Controller.prototype.index[HTTP_CODE]).toBe(201)
  })

  it('Decorators#HttpCode default', () => {
    const Controller = createController()
    Decorators.HttpCode()(Controller.prototype, 'index', Object.getOwnPropertyDescriptor(Controller.prototype, 'index'))
    expect(Controller.prototype.index[HTTP_CODE]).toBe(200)
  })
})
