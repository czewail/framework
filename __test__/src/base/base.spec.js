require('../../../src/helpers');
require('../../daze/src/app/controller/example');
require('../../daze/src/provider/app');
const path = require('path');
const Base = require('../../../src/base/base');
const Application = require('../../../src/foundation/application');
const Config = require('../../../src/config');
const Messenger = require('../../../src/cluster/messenger');
const Response = require('../../../src/response');
const Redirect = require('../../../src/response/redirect');

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Base Class', () => {
  it('should return app instance with app prop', () => {
    const base = new Base();
    expect(base.app).toBeInstanceOf(Application);
  });

  it('should return config instance with config prop', () => {
    const base = new Base();
    expect(base.config).toBeInstanceOf(Config);
  });

  it('should return messenger instance with messenger prop', () => {
    const base = new Base();
    expect(base.messenger).toBeInstanceOf(Messenger);
  });

  it('should return response instance with response method', () => {
    const base = new Base();
    expect(base.response()).toBeInstanceOf(Response);
  });

  it('should return redirect instance with redirect method', () => {
    const base = new Base();
    expect(base.redirect()).toBeInstanceOf(Redirect);
  });
});
