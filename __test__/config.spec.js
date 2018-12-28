const path = require('path')
const Config = require('../src/config')
const app = require('./config/app')
const custom = require('./config/custom')

const configPath = path.resolve(__dirname, './config')
describe('Config', () => {
  it('Config#get', () => {
    const configInstance = new Config(configPath)
    expect(configInstance.get('app')).toBe(app)
    expect(configInstance.get('custom')).toBe(custom)
    expect(configInstance.get('app.port')).toBe(8888)
    expect(configInstance.get('app.cluster.workers')).toBe(0)
    expect(configInstance.get('custom.a.b.c')).toBe('c')
    expect(configInstance.get('custom.a.b.c', 'd')).toBe('c')
    expect(configInstance.get('custom.a.b.d', 'd')).toBe('d')
  })

  it('Config#has', () => {
    const configInstance = new Config(configPath)
    expect(configInstance.has('app')).toBeTruthy()
    expect(configInstance.has('app.cluster.workers')).toBeTruthy()
    expect(configInstance.has('app.cluster.undefineProp')).toBeFalsy()
    expect(configInstance.has('custom.a.b.c')).toBeTruthy()
    expect(configInstance.has('custom.a.b.d')).toBeFalsy()
  })

  it('Config#set', () => {
    const configInstance = new Config(configPath)
    configInstance.set('app.port', 9999)
    configInstance.set('custom.a.b.d', 'd')
    expect(configInstance.get('custom.a.b.d')).toBe('d')
    expect(configInstance.get('app.port')).toBe(9999)
  })

  it('Config#prop', () => {
    const configInstance = new Config(configPath)
    expect(configInstance.app.port).toBe(8888)
  })
})
