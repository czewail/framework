require('reflect-metadata');
const Rest = require('../../../src/decorators/rest');
const Controller = require('../../../src/base/controller');

describe('Rest Decorator', () => {
  it('should patch rest routes and prefix by @Rest', () => {
    @Rest('example')
    class Example extends Controller { }
    expect(Reflect.getMetadata('routes', Example.prototype)).toEqual({
      index: [{ uri: '/', method: 'get' }],
      create: [{ uri: '/create', method: 'get' }],
      show: [{ uri: '/:id', method: 'get' }],
      store: [{ uri: '/', method: 'post' }],
      edit: [{ uri: '/:id/edit', method: 'get' }],
      update: [{ uri: '/:id', method: 'put' }],
      destroy: [{ uri: '/:id', method: 'del' }],
    });
    expect(Reflect.getMetadata('prefix', Example.prototype)).toBe('/example');
  });

  it('should throws decorate method by @Rest', () => {
    expect(() => class Example extends Controller {
      @Rest()
      index() { }
    }).toThrowError();
  });
});
