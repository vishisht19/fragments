// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/routes/api/index');

var Buffer = require('buffer/').Buffer;

describe('Post', () => {
  test('should create a new post', async () => {
    const data = Buffer.from('This is fragment');
    request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(201);
  });
});
