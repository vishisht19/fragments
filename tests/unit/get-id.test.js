// tests/unit/get-id.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users can get a saved fragments data with correct ID', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });

  test('authenticated users get a fragments array', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(JSON.parse(getId.text)).toEqual('This should match');
  });

  test('authenticated users get a fragments array', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/shouldnotwork`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(415);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
