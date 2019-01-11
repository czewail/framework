const path = require('path')
const context = require('../helpers/context')
const Base = require('../../src/base/base')
const Container = require('../../src/container')
const Application = require('../../src/foundation/application')
const Config = require('../../src/config')
const Messenger = require('../../src/cluster/messenger')
const Request = require('../../src/request')
const factory = require('../../src/foundation/injector/context-factory')
const Response = require('../../src/response')
const Redirect = require('../../src/response/redirect')

const mockNext = () => {}

const _app = new Application(path.resolve(__dirname, '../'))

describe('base/base', () => {
  Container.get('config', [])
  const ctx = context({ url: '/store/shoes?page=2&color=blue' })
  ctx.injectorContext = factory(_app, ctx, mockNext)
  const obj = new Base(ctx)
  it('base instance properties', () => {
    expect(obj.app).toBeInstanceOf(Application)
    expect(obj.config).toBeInstanceOf(Config)
    expect(obj.messenger).toBeInstanceOf(Messenger)
    expect(obj.request).toBeInstanceOf(Request)
    expect(obj.ctx).toBe(ctx)
    expect(obj.response).toBeInstanceOf(Response)
    expect(obj.redirect).toBeInstanceOf(Redirect)
  })
})
