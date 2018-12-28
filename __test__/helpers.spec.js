require('../src/helpers')
const path = require('path')
const Response = require('../src/response')
const Container = require('../src/container')
const Redirect = require('../src/response/redirect')
const App = require('../src/foundation/application')
const Config = require('../src/config')

describe('helpers', () => {
  Container.get('app', [__dirname])
  const configPath = path.resolve(__dirname, './config')
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
    expect(app('config', [configPath])).toBeInstanceOf(Config)
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
