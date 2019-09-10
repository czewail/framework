
const path = require('path');
const request = require('supertest');
const { Application } = require('../../../../src');

const app = new Application(path.resolve(__dirname, '../../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('csrf token', () => {
  it('should return 403 code without token', async () => {
    await request(app._server)
      .post('/csrf')
      .expect(403);
  });

  it('do not verify with read verb [get, head, options]', async () => {
    await request(app._server)
      .get('/csrf/get')
      .expect(200);
  });
});
