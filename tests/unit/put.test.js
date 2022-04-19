// tests/unit/put.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/id').expect(401));

  test('Update the fragment with new data', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const putNewData = await request(app)
      .put(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('New data');
    expect(putNewData.statusCode).toBe(200);

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual('New data');
  });

  test('User cannot change the content type', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const putNewData = await request(app)
      .put(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('New data');
    expect(putNewData.statusCode).toBe(400);
  });

  test('Id has to be correct', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const putNewData = await request(app)
      .put(`/v1/fragments/WrongId`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('New data');
    expect(putNewData.statusCode).toBe(404);
  });
});
