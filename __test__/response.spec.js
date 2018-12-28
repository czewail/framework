const context = require('./helpers/context')
const Response = require('../src/response')
const Container = require('../src/container')
// const HttpException = require('../src/Exceptions/HttpException')

describe('Response', () => {
  const ctx = context({ url: '/store/shoes?page=2&color=blue' })
  Container.get('app', [__dirname])
  const response = new Response(ctx)

  it('Response#success()', () => {
    response.success('Zewail')
    expect(response.getData()).toBe('Zewail')
  })

  // it('Response#error()', () => {
  //   expect(() => {
  //     response.error('error', 404)
  //   }).toThrow(HttpException)
  // })

  // it('Response#BadRequest()', () => {
  //   expect(() => {
  //     response.BadRequest()
  //   }).toThrow(HttpException)
  // })
})
