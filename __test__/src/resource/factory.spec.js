const path = require('path')
const Application = require('../../../src/foundation/application')
const Collection = require('../../../src/resource/collection')
const Resource = require('../../../src/resource/resource')
const Item = require('../../../src/resource/item')
const ResourceFactory = require('../../../src/resource/factory')


const app = new Application(path.resolve(__dirname, '../../'))
app.initialize()

describe('Resource Factory', () => {
  it('Resource Factory#serializeResourceData', () => {
    const collection = new Collection()
    const item = new Item()
    const resource = new Resource()
    const resourceFactory = new ResourceFactory(collection)
    const resourceFactory2 = new ResourceFactory(item)
    const resourceFactory3 = new ResourceFactory(resource)
    // collection
    collection.setData([
      {
        color: 'blue',
      }
    ])
    expect(resourceFactory.serializeResourceData()).toEqual({
      data: [
        {
          color: 'blue',
        }
      ]
    })
    collection.withoutKey()
    expect(resourceFactory.serializeResourceData()).toEqual({
      data: [
        {
          color: 'blue',
        }
      ]
    })
    expect(resourceFactory.serializeResourceData(false)).toEqual([
      {
        color: 'blue',
      }
    ])
    // item
    item.setData({
      color: 'blue',
    })
    expect(resourceFactory2.serializeResourceData()).toEqual({
      data: {
        color: 'blue',
      }
    })
    item.withoutKey()
    expect(resourceFactory2.serializeResourceData()).toEqual({
      color: 'blue',
    })
    // resource
    resource.setData({ color: 'blue' })
    expect(resourceFactory3.serializeResourceData()).toEqual({
      data: null
    })
    resource.withoutKey()
    expect(resourceFactory3.serializeResourceData()).toBeNull()
  })

  it('Resource Factory#serializeResourceMeta', () => {
    const resource = new Resource()
    const resourceFactory = new ResourceFactory(resource)
    expect(resourceFactory.serializeResourceMeta()).toBeNull()
    resource.addMeta('color', 'blue')
    expect(resourceFactory.serializeResourceMeta()).toEqual({
      meta: {
        color: 'blue'
      }
    })
  })

  it('Resource Factory#getTransformerFilePath', () => {
    const resource = new Resource()
    const resourceFactory = new ResourceFactory(resource)
    expect(resourceFactory.getTransformerFilePath('userPost')).toBe('userPost.js')
    expect(resourceFactory.getTransformerFilePath('userPost.js')).toBe('userPost.js')
  })

  it('Resource Factory#useTransformer', () => {
    const resource = new Resource()
    const resourceFactory = new ResourceFactory(resource)
    expect(resourceFactory.useTransformer(({ color }) => ({ color: `not ${color}` }), {
      color: 'blue'
    })).toEqual({
      color: 'not blue'
    })

    expect(resourceFactory.useTransformer('color', {
      color: 'blue'
    })).toEqual({
      color: 'not blue'
    })
  })

  it('Resource Factory#output', () => {
    const item = new Item()
    const itemFactory = new ResourceFactory(item)
    item.addMeta('color', 'blue')
    item.setData({
      name: 'color'
    })
    expect(itemFactory.output()).toEqual({
      meta: {
        color: 'blue'
      },
      data: {
        name: 'color'
      }
    })
  })
})
