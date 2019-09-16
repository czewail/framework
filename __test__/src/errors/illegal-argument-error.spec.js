const NotFoundHttpError = require('../../../src/errors/illegal-argument-error');

describe('src/errors/illegal-argument-error', () => {
  it('illegal-argument-error', () => {
    const err = new NotFoundHttpError('error');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('error');
  });

  it('should return default message error: Illegal Argument', () => {
    const err = new NotFoundHttpError();
    expect(err.message).toBe('Illegal Argument');
  });
});
