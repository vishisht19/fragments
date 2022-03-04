// tests/unit/get-id-info.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id/info').expect(401));

  // Using a valid username/password pair should give a successful result
  test('authenticated users gets a status code 200 correct ID', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });

  test('authenticated users can get a saved fragments data with correct ID', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(`${JSON.parse(getId.text).fragment.id}`).toEqual(`${JSON.parse(res.text).fragment.id}`);
  });

  test('user12@gmail does not exist, should post an error with status 401', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}/info`)
      .auth('user12@email.com', 'password1232323232');
    expect(getId.statusCode).toBe(401);
  });

  test('authenticated users cannot get a saved fragments data without correct ID', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/dsda343fdf/info`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(404);
  });
});
