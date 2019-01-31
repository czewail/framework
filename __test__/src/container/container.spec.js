const Container = require('../../../src/container')

it('Container.setInstance', () => {
  const App = class { }
  Container.setInstance(App)
  expect(Container.instance).toBe(App)
})

it('Container.bind and Container.get', () => {
  Container.setInstance(null)
  const App = class { }
  Container.bind(App, App)
  expect(Container.get(App)).toBeInstanceOf(App)
})

it('Container.has', () => {
  Container.setInstance(null)
  const App = class { }
  const Non = class { }
  Container.bind(App, App)
  expect(Container.has(App)).toBeTruthy()
  expect(Container.has(Non)).toBeFalsy()
})

it('Container#bound', () => {
  Container.setInstance(null)
  const App = class { }
  const Non = class { }
  const ContainerInstance = new Container()
  ContainerInstance.singleton(App, App)
  expect(ContainerInstance.bound(App)).toBeTruthy()
  expect(ContainerInstance.bound(Non)).toBeFalsy()
})

it('Container#exists', () => {
  Container.setInstance(null)
  const App = class { }
  const AppInstance = new App()
  const ContainerInstance = new Container()
  ContainerInstance.singleton(AppInstance, AppInstance)
  expect(ContainerInstance.exists(AppInstance)).toBeTruthy()
})

it('singleton and multiton', () => {
  Container.setInstance(null)
  const Singleton = class { }
  const Multiton = class { }
  const normalFun = () => { }
  const ContainerInstance = new Container()
  ContainerInstance.singleton(Singleton, Singleton)
  ContainerInstance.multiton(Multiton, Multiton)
  ContainerInstance.multiton(normalFun, normalFun)
  expect(ContainerInstance.isShared(Singleton)).toBeTruthy()
  expect(ContainerInstance.isShared(Multiton)).toBeFalsy()
  // 非构造函数一律以单例形式存储在容器中
  expect(ContainerInstance.isShared(normalFun)).toBeTruthy()
})

it('instance replace', () => {
  class App extends Container { }
  Container.setInstance(App)
  const app = new App()
  app.singleton('app', App)
  expect(app.make('app')).toBeInstanceOf(App)
})

it('Container#setBinds', () => {
  Container.setInstance(null)
  const map = [
    ['a', 'a', true],
    ['b', 'b', false],
    ['c', 'c', false],
  ]
  const ContainerInstance = new Container()
  ContainerInstance.setBinds(map)
  expect(ContainerInstance.bound('a')).toBeTruthy()
  expect(ContainerInstance.bound('b')).toBeTruthy()
  expect(ContainerInstance.bound('c')).toBeTruthy()
  expect(ContainerInstance.bound('d')).toBeFalsy()
  expect(ContainerInstance.isShared('a')).toBeTruthy()
  expect(ContainerInstance.isShared('b')).toBeTruthy()
  expect(ContainerInstance.isShared('c')).toBeTruthy()
})

Container.setInstance(null)
