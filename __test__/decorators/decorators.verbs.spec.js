
const Decorators = require('../../src/decorators')
const { ROUTES } = require('../../src/symbol')

describe('Decorators.Verbs', () => {
  class Controller {
    get1() {}

    get2() {}

    post1() {}

    post2() {}

    put1() {}

    put2() {}

    patch1() {}

    patch2() {}

    options1() {}

    options2() {}

    delete1() {}

    delete2() {}

    head1() {}

    head2() {}

    all1() {}

    all2() {}
  }

  it('Decorators#Verbs.Get', () => {
    Decorators.Get()(Controller.prototype, 'get1', Object.getOwnPropertyDescriptor(Controller.prototype, 'get1'))
    Decorators.Get('index')(Controller.prototype, 'get2', Object.getOwnPropertyDescriptor(Controller.prototype, 'get2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.get1.method).toBe('get')
    expect(routes.get1.uri).toBe('/')
    expect(routes.get2.method).toBe('get')
    expect(routes.get2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Post', () => {
    Decorators.Post()(Controller.prototype, 'post1', Object.getOwnPropertyDescriptor(Controller.prototype, 'post1'))
    Decorators.Post('index')(Controller.prototype, 'post2', Object.getOwnPropertyDescriptor(Controller.prototype, 'post2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.post1.method).toBe('post')
    expect(routes.post1.uri).toBe('/')
    expect(routes.post2.method).toBe('post')
    expect(routes.post2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Put', () => {
    Decorators.Put()(Controller.prototype, 'put1', Object.getOwnPropertyDescriptor(Controller.prototype, 'put1'))
    Decorators.Put('index')(Controller.prototype, 'put2', Object.getOwnPropertyDescriptor(Controller.prototype, 'put2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.put1.method).toBe('put')
    expect(routes.put1.uri).toBe('/')
    expect(routes.put2.method).toBe('put')
    expect(routes.put2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Patch', () => {
    Decorators.Patch()(Controller.prototype, 'patch1', Object.getOwnPropertyDescriptor(Controller.prototype, 'patch1'))
    Decorators.Patch('index')(Controller.prototype, 'patch2', Object.getOwnPropertyDescriptor(Controller.prototype, 'patch2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.patch1.method).toBe('patch')
    expect(routes.patch1.uri).toBe('/')
    expect(routes.patch2.method).toBe('patch')
    expect(routes.patch2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Delete', () => {
    Decorators.Delete()(Controller.prototype, 'delete1', Object.getOwnPropertyDescriptor(Controller.prototype, 'delete1'))
    Decorators.Delete('index')(Controller.prototype, 'delete2', Object.getOwnPropertyDescriptor(Controller.prototype, 'delete2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.delete1.method).toBe('delete')
    expect(routes.delete1.uri).toBe('/')
    expect(routes.delete2.method).toBe('delete')
    expect(routes.delete2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Options', () => {
    Decorators.Options()(Controller.prototype, 'options1', Object.getOwnPropertyDescriptor(Controller.prototype, 'options1'))
    Decorators.Options('index')(Controller.prototype, 'options2', Object.getOwnPropertyDescriptor(Controller.prototype, 'options2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.options1.method).toBe('options')
    expect(routes.options1.uri).toBe('/')
    expect(routes.options2.method).toBe('options')
    expect(routes.options2.uri).toBe('/index')
  })

  it('Decorators#Verbs.Head', () => {
    Decorators.Head()(Controller.prototype, 'head1', Object.getOwnPropertyDescriptor(Controller.prototype, 'head1'))
    Decorators.Head('index')(Controller.prototype, 'head2', Object.getOwnPropertyDescriptor(Controller.prototype, 'head2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.head1.method).toBe('head')
    expect(routes.head1.uri).toBe('/')
    expect(routes.head2.method).toBe('head')
    expect(routes.head2.uri).toBe('/index')
  })

  it('Decorators#Verbs.All', () => {
    Decorators.All()(Controller.prototype, 'all1', Object.getOwnPropertyDescriptor(Controller.prototype, 'all1'))
    Decorators.All('index')(Controller.prototype, 'all2', Object.getOwnPropertyDescriptor(Controller.prototype, 'all2'))
    const routes = Controller.prototype[ROUTES]
    expect(routes.all1.method).toBe('all')
    expect(routes.all1.uri).toBe('/')
    expect(routes.all2.method).toBe('all')
    expect(routes.all2.uri).toBe('/index')
  })
})
