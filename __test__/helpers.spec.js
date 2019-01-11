require('../src/helpers')
const path = require('path')
const Response = require('../src/response')
const Container = require('../src/container')
const Redirect = require('../src/response/redirect')
const App = require('../src/foundation/application')
const Config = require('../src/config')
const Application = require('../src/foundation/application')

const _app = new Application(__dirname)

describe('helpers', () => {
  Container.get('app', [__dirname])
  it('res', () => {
    expect(res()).toBeInstanceOf(Response)
  })

  it('redirect', () => {
    expect(redirect()).toBeInstanceOf(Redirect)
  })

  it('app', () => {
    expect(app()).toBeInstanceOf(App)
  })

  it('config', () => {
    expect(app('config')).toBeInstanceOf(Config)
  })
  it('global overflow', () => {
    global.res = () => true
    global.app = () => true
    global.redirect = () => true
    expect(res()).toBeTruthy()
    expect(app()).toBeTruthy()
    expect(redirect()).toBeTruthy()
  })
})
