
const Transformer = require('../../../src/resource/transformer')


describe('Tansformer', () => {
  it('Tansformer#collection', () => {
    const transformer = new Transformer()
    expect(transformer.collection([{
      color: 'blue'
    }])).toEqual({
      data: [{
        color: 'blue'
      }]
    })
  })

  it('Tansformer#item', () => {
    const transformer = new Transformer()
    expect(transformer.item({
      color: 'blue'
    })).toEqual({
      data: {
        color: 'blue'
      }
    })
  })

  it('Transformer#toJSON', () => {
    const transformer = new Transformer()
    expect(transformer.toJSON({ color: 'blue' })).toEqual({ color: 'blue' })
  })
})
