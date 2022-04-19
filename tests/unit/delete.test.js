// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('Delete /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/:id').expect(401));

  // Using a valid username/password pair should give a successful result
  test('authenticated users can delete a fragment and get a status code 200 for correct ID', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Test');

    const getId = await request(app)
      .delete(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });

  test('user12@gmail does not exist, should post an error with status 401', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .delete(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
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
      .delete(`/v1/fragments/dsda343fdf`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(404);
  });
});
