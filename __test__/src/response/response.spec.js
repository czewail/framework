const path = require('path')
const Application = require('../../../src/foundation/application')
const Response = require('../../../src/response')
const HttpError = require('../../../src/errors/http-error')


const app = new Application(path.resolve(__dirname, '../../'))
app.initialize()

describe('Response', () => {
  it('Response#data', () => {
    const response = new Response('yellow')
    expect(response.getData()).toBe('yellow')
    response.success('blue')
    expect(response.getData()).toBe('blue')
    response.setData('color')
    expect(response.getData()).toBe('color')
  })

  it('Response#error', () => {
    const response = new Response()
    expect(() => {
      response.error('err')
    }).toThrowError(HttpError)
  })

  it('Response#header', () => {
    const response = new Response()
    expect(response.getHeader()).toEqual({})
    response.setHeader('color', 'blue')
    expect(response.getHeader()).toEqual({
      color: 'blue'
    })
    response.setHeader({
      name: 'color'
    })
    expect(response.getHeader()).toEqual({
      color: 'blue',
      name: 'color'
    })
    expect(response.getHeaders()).toEqual({
      color: 'blue',
      name: 'color'
    })
    response.setHeaders({
      size: 'big'
    })
    expect(response.getHeaders()).toEqual({
      color: 'blue',
      name: 'color',
      size: 'big'
    })
  })

  it('Response#code', () => {
    const response = new Response()
    expect(response.getCode()).toBe(200)
    response.setCode(404)
    expect(response.getCode()).toBe(404)
    expect(response.getStatus()).toBe(404)
    response.setStatus(500)
    expect(response.getStatus()).toBe(500)
  })

  it('Response#header methods', () => {
    const response = new Response()
    response.lastModified('Mon, 1 Apr 2019 00:00:00 GMT')
    expect(response.getHeader('Last-Modified')).toBe('Mon, 1 Apr 2019 00:00:00 GMT')
    response.expires(1000)
    expect(response.getHeader('Expires')).toBe(1000)
    response.eTag('abcdefg')
    expect(response.getHeader('ETag')).toBe('abcdefg')
    response.cacheControl('no-cache')
    expect(response.getHeader('Cache-Control')).toBe('no-cache')
    response.contentType('application/json')
    expect(response.getHeader('Content-Type')).toBe('application/json; charset=utf-8')
    response.contentType('application/json', 'gbk')
    expect(response.getHeader('Content-Type')).toBe('application/json; charset=gbk')
    response.noCache()
    expect(response.getHeader('Cache-Control')).toBe('no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
    expect(response.getHeader('Pragma')).toBe('no-cache')
  })

  it('Response#attachment', () => {
    const response = new Response()
    response.attachment('test.xlsx')
    expect(response.getHeader('Content-Disposition')).not.toBeNull()
    response.download('stream', 'test.xlsx')
    expect(response.getData()).toBe('stream')
    expect(response.getHeader('Content-Disposition')).not.toBeNull()
  })
})
