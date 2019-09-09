require('reflect-metadata');
const path = require('path');
const Loader = require('../../../src/loader');
const Application = require('../../../src/foundation/application');
const Controller = require('../../../src/base/controller');
const Middleware = require('../../../src/base/middleware');
const Service = require('../../../src/base/service');
const Validator = require('../../../src/base/validator');
const Resource = require('../../../src/base/resource');
const { Route, Component } = require('../../../src/decorators');

const app = new Application(path.resolve(__dirname, '../../daze/src'));

describe('Loader', () => {
  it('should auto load specil file', () => {
    const loader = new Loader(app);
    const res = [];
    loader.loadFile = (filePath) => {
      res.push(filePath);
    };
    loader.autoLoadApp();
    expect(res.includes(require.resolve('../../daze/src/app/controller/example'))).toBeTruthy();
    expect(res.includes(require.resolve('../../daze/src/app/service/examle'))).toBeTruthy();
  });

  it('should parse module each type', () => {
    const loader = new Loader(app);

    @Route()
    class ExampleController extends Controller { }

    @Component('example')
    class ExampleService extends Service { }

    @Component('example')
    class ExampleResource extends Resource { }

    @Component('example')
    class ExampleValidator extends Validator { }

    @Component('example')
    class ExampleMiddleware extends Middleware { }

    @Component('example')
    class ExampleComponent { }

    loader.parseModule(ExampleController, 'controller');
    loader.parseModule(ExampleService, 'service');
    loader.parseModule(ExampleResource, 'resource');
    loader.parseModule(ExampleMiddleware, 'middleware');
    loader.parseModule(ExampleValidator, 'validator');
    loader.parseModule(ExampleComponent, 'component');

    expect(loader.controllers.includes(ExampleController)).toBeTruthy();
    expect(loader.middlewares.includes(ExampleMiddleware)).toBeTruthy();
    expect(loader.components.includes(ExampleService)).toBeTruthy();
    expect(loader.components.includes(ExampleResource)).toBeTruthy();
    expect(loader.components.includes(ExampleValidator)).toBeTruthy();
    expect(loader.components.includes(ExampleComponent)).toBeTruthy();
  });
});
