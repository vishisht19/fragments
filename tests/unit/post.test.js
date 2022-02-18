// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/routes/api/index');

var Buffer = require('buffer/').Buffer;

describe('Post', () => {
  test('should create a new post', async () => {
    let data = Buffer.from('This is fragment', 'utf-8');
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .write(data);
    //.attach(data);

    expect(200);
  });
});
