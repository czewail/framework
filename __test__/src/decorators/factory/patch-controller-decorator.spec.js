
const { patchClass, patchProperty, patchMethod } = require('../../../../src/decorators/factory/patch-controller-decorator')
const { METHOD_INJECTORS, PROPERTY_INJECTORS, CONSTRUCTOR_INJECTORS } = require('../../../../src/symbol')


describe('src/decorators/factory/patch-controller-decorator', () => {
  it('patchClass', () => {
    class A {}
    patchClass('request', ['param1', 'param2'], A)
    expect(A.prototype[CONSTRUCTOR_INJECTORS]).toEqual([
      ['request', ['param1', 'param2']],
    ])
  })

  it('patchProperty', () => {
    class A {
      constructor() {
        this.name = null
      }
    }

    const a = new A()
    patchProperty('request', ['param1', 'param2'], a, 'name')
    expect(a[PROPERTY_INJECTORS]).toEqual({
      name: ['request', ['param1', 'param2']]
    })
  })

  it('patchMethod', () => {
    class A {
      hello() {}
    }

    const a = new A()
    patchMethod('request', ['param1', 'param2'], a, 'hello')
    expect(a[METHOD_INJECTORS]).toEqual({
      hello: [
        ['request', ['param1', 'param2']],
      ]
    })
  })
})
