const HttpError = require('../../../src/errors/http-error');
const ValidateError = require('../../../src/errors/validate-http-error');

describe('src/errors/validate-error', () => {
  it('validate-error', () => {
    const err = new ValidateError('error');
    expect(err).toBeInstanceOf(HttpError);
    expect(err.code).toBe(422);
  });
});
