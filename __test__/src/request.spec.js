require('../../src/helpers');
const path = require('path');
const Request = require('../../src/request');
const context = require('../common/context');

const Application = require('../../src/foundation/application');

const app = new Application(path.resolve(__dirname, '../'));
app.initialize();

describe('Request', () => {
  it('Request#headers', () => {
    const _headers = {
      name: 'dazejs',
    };
    const { req, res } = context({
      headers: _headers,
    });
    const instance = new Request(req, res);
    expect(instance.headers).toEqual(_headers);
  });

  it('Request#getHeader() and get()', () => {
    const _headers = {
      name: 'dazejs',
      referer: 'localhost',
    };
    const { req, res } = context({
      headers: _headers,
    });
    const instance = new Request(req, res);
    expect(instance.getHeader('name')).toEqual(_headers.name);
    expect(instance.get('name')).toEqual(_headers.name);
    expect(instance.getHeader('referer')).toEqual(_headers.referer);
    expect(instance.getHeader('referrer')).toEqual(_headers.referer);
  });

  it('Request#method', () => {
    const { req, res } = context({
      method: 'POST',
    });
    const instance = new Request(req, res);
    expect(instance.method).toEqual('POST');
    expect(instance.getMethod()).toEqual('POST');
    expect(instance.isOptions()).toBeFalsy();
    expect(instance.isHead()).toBeFalsy();
    expect(instance.isGet()).toBeFalsy();
    expect(instance.isPost()).toBeTruthy();
    expect(instance.isPut()).toBeFalsy();
    expect(instance.isPatch()).toBeFalsy();
    expect(instance.isDelete()).toBeFalsy();
  });

  it('Request#length', () => {
    const _headers = {
      'content-length': '10',
    };
    const { req, res } = context({
      headers: _headers,
    });
    const instance = new Request(req, res);
    expect(instance.length).toBe(10);
    expect(instance.getLength()).toBe(10);

    const { req: req2, res: res2 } = context();
    const instance2 = new Request(req2, res2);
    expect(instance2.length).toBeUndefined();
  });

  it('Request#url', () => {
    const request = {
      url: '/users?name=zewail',
    };
    const { req, res } = context(request);
    const instance = new Request(req, res);
    expect(instance.url).toBe(request.url);
    expect(instance.getUrl()).toBe(request.url);
  });

  it('Request#socket', () => {
    const request = {
      url: '/users?name=zewail',
    };
    const { req, res } = context(request);
    const instance = new Request(req, res);
    expect(instance.socket).toBe(req.socket);
    expect(instance.getSocket()).toBe(req.socket);
  });

  it('Request#protocol', () => {
    const request = {
      url: '/users?name=zewail',
      headers: {
        'x-forwarded-proto': 'https, http',
      },
    };
    const { req, res } = context(request);
    const instance = new Request(req, res);
    expect(instance.protocol).toBe('http');
    app.get('config').set('app.proxy', true);
    expect(instance.protocol).toBe('https');
  });
});
