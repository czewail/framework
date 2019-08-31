

const Response = require('../../../src/response');

describe('Response', () => {
  it('should code setter and code getter accordance', () => {
    const response = new Response();
    response.code = 404;
    expect(response.code).toBe(404);
    expect(response.getCode()).toBe(404);
    expect(response.getStatus()).toBe(404);
  });

  it('should data setter and data getter accordance', () => {
    const response = new Response();
    const data = {};
    response.data = data;
    expect(response.data).toBe(data);
  });

  describe('Response#error', () => {
    it('should set code and data', () => {
      const response = new Response();
      response.error('message', 404);
      expect(response.data).toBe('message');
      expect(response.code).toBe(404);
    });
  });


  describe('Response#success', () => {
    it('should set code and data', () => {
      const response = new Response();
      response.success('message', 200);
      expect(response.data).toBe('message');
      expect(response.code).toBe(200);
    });

    it('should set default code 200', () => {
      const response = new Response();
      response.success('message');
      expect(response.code).toBe(200);
    });
  });

  describe('Response#headers', () => {
    it('should return header by getHeader', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      expect(response.getHeader('Content-Type')).toBe('application/json');
    });

    it('should return header by getHeader and lower key', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      expect(response.getHeader('content-type')).toBe('application/json');
    });

    it('should return all headers by getHeaders', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
        Accepts: 'application/json',
      });
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });

    it('should set header by setHeader', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      response.setHeader('accepts', 'application/json');
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });

    it('should set headers by setHeaders', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      response.setHeaders({
        accepts: 'application/json',
      });
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });
  });
});
