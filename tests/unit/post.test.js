// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('Post', () => {
  test('should create a new post', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(res.statusCode).toBe(201);
  });

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));
});
