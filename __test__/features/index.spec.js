const path = require('path');
const request = require('supertest');
const { Application } = require('../../src');


const app = new Application(path.resolve(__dirname, '../daze/src'));

it('should work base', async (done) => {
  const server = await app.run();
  await request(server).get('/example').expect(200);
  await app.close();
  done();
});
