const path = require('path')
const Cookie = require('../../../src/cookie')
const Application = require('../../../src/foundation/application')


describe('Cookie', () => {
  const app = new Application(path.resolve(__dirname, '../../'))
  app.initialize()

  it('Cookie#getOptions', () => {
    const cookie = new Cookie('color')
    expect(cookie.getOptions()).toEqual(app.get('config').get('cookie'))
  })

  it('Cookie#getName', () => {
    const cookie = new Cookie('color')
    expect(cookie.getName()).toBe('color')
  })

  it('Cookie#getValue', () => {
    const cookie = new Cookie('color', 'blue')
    expect(cookie.getValue()).toBe('blue')
  })

  it('Cookie#setValue', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setValue('yellow')
    expect(cookie.getValue()).toBe('yellow')
    cookie.setValue()
    expect(cookie.getValue()).toBeNull()
  })

  it('Cookie#setHttpOnly', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setHttpOnly(true)
    expect(cookie.getOptions().httpOnly).toBeTruthy()
    cookie.setHttpOnly()
    expect(cookie.getOptions().httpOnly).toBeTruthy()
    cookie.setHttpOnly(false)
    expect(cookie.getOptions().httpOnly).toBeFalsy()
  })

  it('Cookie#setSigned', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setSigned(true)
    expect(cookie.getOptions().signed).toBeTruthy()
    cookie.setSigned()
    expect(cookie.getOptions().signed).toBeTruthy()
    cookie.setSigned(false)
    expect(cookie.getOptions().signed).toBeFalsy()
  })


  it('Cookie#shouldSigned', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.shouldSigned()
    expect(cookie.getOptions().signed).toBeTruthy()
  })

  it('Cookie#doNotSigned', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.doNotSigned()
    expect(cookie.getOptions().signed).toBeFalsy()
  })


  it('Cookie#setMaxAge', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setMaxAge(1000)
    expect(cookie.getOptions().maxAge).toBe(1000)
    cookie.setMaxAge()
    expect(cookie.getOptions().maxAge).toBe(0)
  })


  it('Cookie#setDomain', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setDomain('.abc.com')
    expect(cookie.getOptions().domain).toBe('.abc.com')
    cookie.setDomain()
    expect(cookie.getOptions().domain).toBe('')
  })

  it('Cookie#setPath', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setPath('/blog')
    expect(cookie.getOptions().path).toBe('/blog')
    cookie.setPath()
    expect(cookie.getOptions().path).toBe('/')
  })


  it('Cookie#setSecure', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setSecure(true)
    expect(cookie.getOptions().secure).toBeTruthy()
    cookie.setSecure()
    expect(cookie.getOptions().secure).toBeFalsy()
    cookie.setSecure(false)
    expect(cookie.getOptions().secure).toBeFalsy()
  })


  it('Cookie#setExpires', () => {
    const cookie = new Cookie('color', 'blue')
    cookie.setExpires(1000)
    expect(cookie.getOptions().expires).toBe(1000)
  })
})
