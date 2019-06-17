require('../../src/helpers');
const path = require('path');
const Request = require('../../src/request');
const context = require('../common/context');

const Application = require('../../src/foundation/application');

const app = new Application(path.resolve(__dirname, '../'));
app.initialize();

describe('Request', () => {
  describe('Request#headers', () => {
    it('should return the request headers', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.headers).toEqual(_headers);
    });

    it('should return the request headers when no getHeader name', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeader()).toEqual(_headers);
    });

    it('should return header value use getHeader name', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeader('name')).toEqual('dazejs');
      expect(instance.get('name')).toEqual(_headers.name);
    });

    it('need to be compatible with referer and referrer', () => {
      const _headers = {
        name: 'dazejs',
        referer: 'localhost',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeader('referer')).toEqual(_headers.referer);
      expect(instance.getHeader('referrer')).toEqual(_headers.referer);
    });

    it('should return "" when not set headers key', () => {
      const { req, res } = context({});
      const instance = new Request(req, res);
      expect(instance.getHeader('referer')).toBe('');
      expect(instance.getHeader('name')).toBe('');
    });
  });

  describe('Request#method', () => {
    it('when method is get', () => {
      const { req, res } = context({
        method: 'GET',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('GET');
      expect(instance.getMethod()).toEqual('GET');
      expect(instance.isGet()).toBeTruthy();
    });

    it('when method is post', () => {
      const { req, res } = context({
        method: 'POST',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('POST');
      expect(instance.getMethod()).toEqual('POST');
      expect(instance.isPost()).toBeTruthy();
    });

    it('when method is put', () => {
      const { req, res } = context({
        method: 'PUT',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('PUT');
      expect(instance.getMethod()).toEqual('PUT');
      expect(instance.isPut()).toBeTruthy();
    });

    it('when method is patch', () => {
      const { req, res } = context({
        method: 'PATCH',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('PATCH');
      expect(instance.getMethod()).toEqual('PATCH');
      expect(instance.isPatch()).toBeTruthy();
    });

    it('when method is delete', () => {
      const { req, res } = context({
        method: 'DELETE',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('DELETE');
      expect(instance.getMethod()).toEqual('DELETE');
      expect(instance.isDelete()).toBeTruthy();
    });

    it('when method is head', () => {
      const { req, res } = context({
        method: 'HEAD',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('HEAD');
      expect(instance.getMethod()).toEqual('HEAD');
      expect(instance.isHead()).toBeTruthy();
    });

    it('when method is options', () => {
      const { req, res } = context({
        method: 'OPTIONS',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('OPTIONS');
      expect(instance.getMethod()).toEqual('OPTIONS');
      expect(instance.isOptions()).toBeTruthy();
    });
  });

  describe('Request#length', () => {
    it('should return content-length header as a number', () => {
      const _headers = {
        'content-length': '10',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.length).toBe(10);
      expect(instance.getLength()).toBe(10);
    });

    it('should return undefined when no content-length', () => {
      const { req, res } = context({});
      const instance2 = new Request(req, res);
      expect(instance2.length).toBeUndefined();
    });
  });

  describe('Request#url', () => {
    it('should use req.url', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.url).toBe(request.url);
      expect(instance.getUrl()).toBe(request.url);
    });
  });

  describe('Request#socket', () => {
    it('should use req.socket', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.socket).toBe(req.socket);
      expect(instance.getSocket()).toBe(req.socket);
    });
  });


  describe('Request#protocol', () => {
    it('when https', () => {
      const request = {
        socket: { encrypted: true },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.protocol).toBe('https');
      expect(instance.getProtocol()).toBe('https');
    });

    it('when http', () => {
      const request = {
        socket: { encrypted: false },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.protocol).toBe('http');
      expect(instance.getProtocol()).toBe('http');
    });

    it('when proxy is not trusted', () => {
      const request = {
        url: '/users?name=zewail',
        headers: {
          'x-forwarded-proto': 'https, http',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.protocol).toBe('http');
    });

    it('when proxy is trusted and no x-forwarded-proto', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.protocol).toBe('http');
    });

    it('when proxy is trusted', () => {
      const request = {
        url: '/users?name=zewail',
        headers: {
          'x-forwarded-proto': 'https, http',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.protocol).toBe('https');
    });
  });

  describe('Request#host', () => {
    it('should return host with port', () => {
      const request = {
        headers: {
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when no host', () => {
      const { req, res } = context({});
      const instance = new Request(req, res);
      expect(instance.host).toBe('');
    });

    it('when http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          ':authority': 'xxx.com:9000',
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:9000');
    });

    it('when http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          ':authority': 'xxx.com:9000',
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('should use host as fallback when http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is not trusted on http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is not trusted on http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is trusted on http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com, zzz.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.host).toBe('yyy.com');
    });

    it('when proxy is trusted on http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com, zzz.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.host).toBe('yyy.com');
    });
  });

  describe('Request#origin', () => {
    it('should return protocol and host', () => {
      const request = {
        headers: {
          host: 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.origin).toBe('http://yyy.com');
      expect(instance.getOrigin()).toBe('http://yyy.com');
    });
  });
});
