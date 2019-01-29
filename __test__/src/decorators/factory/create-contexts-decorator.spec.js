
const { createController } = require('../../../helpers/utils')
const createContextsDecorator = require('../../../../src/decorators/factory/create-contexts-decorator')
const { METHOD_INJECTORS, PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS } = require('../../../../src/symbol')

describe('src/decorators/factory/create-contexts-decorator', () => {
  it('create contexts decorator - class', () => {
    const Controller = createController()
    createContextsDecorator('request')()(Controller)
    expect(Controller.prototype[CONSTRUCTOR_INJECTORS]).toEqual([
      ['request', []]
    ])
  })

  it('create contexts decorator - property', () => {
    const Controller = createController()
    createContextsDecorator('request')('param1', 'param2')(Controller.prototype, 'hello', Object.getOwnPropertyDescriptor(Controller.prototype, 'hello'))
    expect(Controller.prototype[PROPERTY_INJECTORS]).toEqual({
      hello: ['request', ['param1', 'param2']]
    })
  })


  it('create contexts decorator - method', () => {
    const Controller = createController()
    createContextsDecorator('request')('param1', 'param2')(Controller.prototype, 'index', Object.getOwnPropertyDescriptor(Controller.prototype, 'index'))
    expect(Controller.prototype[METHOD_INJECTORS]).toEqual({
      index: [
        ['request', ['param1', 'param2']]
      ]
    })
  })
})
