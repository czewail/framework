jest.mock('redis');


const path = require('path');
require('../../../../src/helpers');
require('../../../daze/src/app/controller/example');
require('../../../daze/src/provider/app');
const Application = require('../../../../src/foundation/application');
const RedisSessionStore = require('../../../../src/session/stores/redis');


const app = new Application(path.resolve(__dirname, '../../../daze/src'));

beforeAll(() => app.initialize());

describe('session redis store', () => {
  it('should has get method', () => {
    const store = new RedisSessionStore(app);
    expect(Reflect.has(store, 'get')).toBeTruthy();
    expect(typeof store.get === 'function').toBeTruthy();
  });

  it('should has set method', () => {
    const store = new RedisSessionStore(app);
    expect(Reflect.has(store, 'set')).toBeTruthy();
    expect(typeof store.set === 'function').toBeTruthy();
  });

  it('should has destroy method', () => {
    const store = new RedisSessionStore(app);
    expect(Reflect.has(store, 'destroy')).toBeTruthy();
    expect(typeof store.destroy === 'function').toBeTruthy();
  });

  it('should return redis config with getRedisConfigure method', () => {
    const store = new RedisSessionStore(app);
    expect(store.getRedisConfigure()).toEqual({
      host: '127.0.0.1',
      port: 6379,
    });
  });

  it('should return ok with get method', async () => {
    const store = new RedisSessionStore(app);
    const res = await store.get('key');
    expect(res).toEqual({
      test: 'aaa',
    });
  });

  it('should return true with set method', async () => {
    const store = new RedisSessionStore(app);
    const res = await store.set('key', 'value');
    expect(res).toBeTruthy();
  });

  it('should return true throws with del method', async () => {
    const store = new RedisSessionStore(app);
    const res = await store.destroy('key');
    expect(res).toBeTruthy();
  });
});
