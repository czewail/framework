require('reflect-metadata');
const {
  Route, Http,
} = require('../../../src/decorators');


describe('verb Decorator', () => {
  it('should patch get route', () => {
    @Route('users')
    class Example {
      @Http.Get()
      index() {}
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.index).toEqual([
      {
        method: 'get',
        uri: '',
      },
    ]);
  });

  it('should patch post route', () => {
    @Route('users')
    class Example {
      @Http.Post(':id')
      store() { }
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.store).toEqual([
      {
        method: 'post',
        uri: '/:id',
      },
    ]);
  });

  it('should patch put route', () => {
    @Route('users')
    class Example {
      @Http.Put(':id')
      put() { }
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.put).toEqual([
      {
        method: 'put',
        uri: '/:id',
      },
    ]);
  });

  it('should patch options route', () => {
    @Route('users')
    class Example {
      @Http.Options(':id')
      options() { }
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.options).toEqual([
      {
        method: 'options',
        uri: '/:id',
      },
    ]);
  });

  it('should patch head route', () => {
    @Route('users')
    class Example {
      @Http.Head(':id')
      head() { }
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.head).toEqual([
      {
        method: 'head',
        uri: '/:id',
      },
    ]);
  });

  it('should patch delete route', () => {
    @Route('users')
    class Example {
      @Http.Delete(':id')
      del() { }
    }
    const routes = Reflect.getMetadata('routes', Example.prototype);
    expect(routes.del).toEqual([
      {
        method: 'delete',
        uri: '/:id',
      },
    ]);
  });
});
