const path = require('path')
const Application = require('../../../src/foundation/application')
const Resource = require('../../../src/resource/resource')


const app = new Application(path.resolve(__dirname, '../../'))
app.initialize()

describe('Resource', () => {
  it('Resource#key', () => {
    const resource = new Resource({
      color: 'blue'
    })
    expect(resource.getKey()).toBe('data')
    resource.setKey('result')
    expect(resource.getKey()).toBe('result')
    resource.withoutKey()
    expect(resource.getKey()).toBeNull()
    const resource2 = new Resource({
      color: 'blue'
    }, data => data, 'result')
    expect(resource2.getKey()).toBe('result')
  })

  it('Resource#data', () => {
    const resource = new Resource({
      color: 'blue'
    })
    expect(resource.getData()).toEqual({
      color: 'blue'
    })
    resource.setData({
      color: 'yellow'
    })
    expect(resource.getData()).toEqual({
      color: 'yellow'
    })
  })

  it('Resource#meta', () => {
    const resource = new Resource({
      color: 'blue'
    })
    expect(resource.getMeta()).toBeNull()
    resource.setMeta({
      color: 'yellow'
    })
    expect(resource.getMeta()).toEqual({
      color: 'yellow'
    })
    resource.addMeta('name', 'color')
    expect(resource.getMeta()).toEqual({
      color: 'yellow',
      name: 'color'
    })
    // addMeta when meta equal null
    resource.setMeta(null)
    resource.addMeta('name', 'color')
    expect(resource.getMeta()).toEqual({
      name: 'color'
    })
    // add object meta
    resource.addMeta({
      color: 'blue'
    })
    expect(resource.getMeta()).toEqual({
      name: 'color',
      color: 'blue'
    })
    resource.addMeta()
    expect(resource.getMeta()).toEqual({
      name: 'color',
      color: 'blue'
    })
    // add meta format
    resource.addMeta({
      color: 'blue'
    }, data => data)
    expect(typeof resource.getMetaFormatter()).toBe('function')
  })

  it('Resource#formatter', () => {
    const resource = new Resource({
      color: 'blue'
    })
    const resource2 = new Resource({
      color: 'blue'
    }, data => data)
    expect(resource.getFormatter()).toBeNull()
    resource.setFormatter(data => data)
    expect(typeof resource.getFormatter()).toBe('function')
    expect(typeof resource2.getFormatter()).toBe('function')
  })

  it('Resource#meta formatter', () => {
    const resource = new Resource({
      color: 'blue'
    })
    expect(resource.getMetaFormatter()).toBeNull()
    resource.setMetaFormatter(data => data)
    expect(typeof resource.getMetaFormatter()).toBe('function')
  })
})
