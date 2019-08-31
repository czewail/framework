require('reflect-metadata');
require('../../daze/src/app/controller/example');
require('../../daze/src/provider/app');
const path = require('path');
const Application = require('../../../src/foundation/application');
const Resource = require('../../../src/resource/resource');

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Resource', () => {
  it('should setFormatter and getFmatter suucessful', () => {
    const resource = new Resource();
    const formatter = () => {};
    resource.setFormatter(formatter);
    expect(resource.getFormatter()).toBe(formatter);
  });

  it('should setMetaFormatter and getMetaFmatter suucessful', () => {
    const resource = new Resource();
    const formatter = () => { };
    resource.setMetaFormatter(formatter);
    expect(resource.getMetaFormatter()).toBe(formatter);
  });

  it('should getKey and setKey scuessful', () => {
    const resource = new Resource();
    resource.setKey('data');
    expect(resource.getKey()).toBe('data');
  });

  it('should setData and getData successful', () => {
    const resource = new Resource();
    const data = {};
    resource.setData(data);
    expect(resource.getData()).toBe(data);
  });

  it('should setMeta and getMeta successful', () => {
    const resource = new Resource();
    const data = {};
    resource.setMeta(data);
    expect(resource.getMeta()).toBe(data);
  });

  describe('Resource#addMeta', () => {
    it('should add meta with string params', () => {
      const resource = new Resource();
      resource.addMeta('key', 'value');
      expect(resource.getMeta()).toEqual({
        key: 'value',
      });
    });

    it('should add meta with object params', () => {
      const resource = new Resource();
      resource.addMeta({
        aaa: 'bbb',
      });
      expect(resource.getMeta()).toEqual({
        aaa: 'bbb',
      });
    });

    it('should do nothing with unsupported params type', () => {
      const resource = new Resource();
      resource.addMeta(() => {});
      expect(resource.getMeta()).toEqual({});
    });
  });

  it('should set null with withoutKey method', () => {
    const resource = new Resource();
    resource.withoutKey();
    expect(resource.getKey()).toBeNull();
  });
});
