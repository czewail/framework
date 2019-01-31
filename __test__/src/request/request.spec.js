const context = require('../../helpers/context')
const Request = require('../../../src/request')

describe('Request', () => {
  const ctx = context({ url: '/store/shoes?page=2&color=blue' })
  const request = new Request(ctx)

  it('Request#param()', () => {
    expect(request.param('page')).toBe('2')
    expect(request.param('color')).toBe('blue')
    expect(request.param('unname', 'example')).toBe('example')
    expect(request.param()).toEqual({ page: '2', color: 'blue' })
  })

  it('Request#only()', () => {
    expect(request.only('page')).toEqual({ page: '2' })
    expect(request.only('page', 'color')).toEqual({ page: '2', color: 'blue' })
    expect(request.only(['page', 'color'])).toEqual({ page: '2', color: 'blue' })
    expect(request.only(['page'], ['color'])).toEqual({ page: '2', color: 'blue' })
    expect(request.only(['page'], 'color')).toEqual({ page: '2', color: 'blue' })
    expect(request.only(['page'])).toEqual({ page: '2' })
    expect(request.only(['page'], 'color')).toEqual({ page: '2', color: 'blue' })
  })

  it('Request#except()', () => {
    expect(request.except('page')).toEqual({ color: 'blue' })
    expect(request.except('color')).toEqual({ page: '2' })
    expect(request.except(['page', 'color'])).toEqual({})
    expect(request.except(['page'])).toEqual({ color: 'blue' })
    expect(request.except(['page'], 'color')).toEqual({})
    expect(request.except(['page'])).toEqual({ color: 'blue' })
  })

  it('Request#has()', () => {
    expect(request.has('page')).toBeTruthy()
    expect(request.has('name')).toBeFalsy()
  })

  it('Request#prop', () => {
    expect(request.page).toBe('2')
    expect(request.color).toBe('blue')
    expect(request.query).toEqual({ page: '2', color: 'blue' })
  })
})
