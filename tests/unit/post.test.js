// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
const assert = require('assert');
describe('Post', () => {
  test('unauthenticated requests', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can create a plain text fragment', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(res.statusCode).toBe(201);
  });

  test('authenticated users can create a plain text fragment', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data')
      .expect(function (res) {
        // eslint-disable-next-line no-prototype-builtins
        assert(res.body.hasOwnProperty('Location'));
      });
  });

  test('text/* content type returns 201 status', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('<h1>data</h1>');
    expect(res.statusCode).toBe(201);
  });

  test('application/json content type returns 201 status', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(`{data}`);
    expect(res.statusCode).toBe(201);
  });

  test('Invalid content type', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'tex')
      .send('data');
    expect(res.statusCode).toBe(500);
  });

  test('Missing content type ', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('data');
    expect(res.statusCode).toBe(415);
  });

  test('Missing body ', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('');
    expect(res.statusCode).toBe(415);
  });
});
