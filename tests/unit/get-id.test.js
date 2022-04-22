// tests/unit/get-id.test.js

const request = require('supertest');
var md = require('markdown-it')();
const app = require('../../src/app');
const fs = require('fs');

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const path = require('path');
// eslint-disable-next-line no-undef
const filePath = path.join(__dirname, 'test-files/example.png');
//const filePath = `${__dirname}\\test-files\\example.png`;

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

  // Using a valid username/password pair should give a successful result
  test('authenticated users gets a status code 200 correct ID', async () => {
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

  test('authenticated users can get a saved fragments data with correct ID', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual(`This should match`);
  });

  test('authenticated users with .txt extension should yield result', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(`This should match`);

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual(`This should match`);
  });

  test('authenticated users with type text/html should yield the results in that type', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(`<h1>This should match</h1>`);

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual(`<h1>This should match</h1>`);
  });

  test('authenticated users with .html extension should yield result converted into text/html type', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('**bold**');
    let data = '**bold**';
    var result = md.render(data.toString('utf8'));
    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual(result.toString('utf8'));
  });

  test('authenticated users with .md extension should yield result converted into text/markdown type', async () => {
    let data = '<h1>This is a fragment</h1>';
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual('This is a fragment\n==================');
  });

  test('authenticated users with type text/markdown should yield the results converted into that type', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(`# This should match`);

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.text).toEqual(`# This should match`);
  });

  test('authenticated users with valid image type should yield the results and status code 200', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(fs.readFileSync(filePath));

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });

  test('authenticated users with ext .jpg should be successful and yield status 200', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(fs.readFileSync(filePath));

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.jpg`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });
  test('authenticated users with ext .webp should be successful and yield status 200', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(fs.readFileSync(filePath));

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.webp`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });
  test('authenticated users with ext .gif should be successful and yield status 200', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(fs.readFileSync(filePath));

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.gif`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });
  test('authenticated users with ext .png should be successful and yield status 200', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(fs.readFileSync(filePath));

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.png`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(200);
  });

  test('invalid id should throw 404 err', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This should match');

    const getId = await request(app).get(`/v1/fragments/xyz`).auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(404);
  });

  test('Non-recognizable extension should yield 415 status code', async () => {
    let res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This should match');

    const getId = await request(app)
      .get(`/v1/fragments/${JSON.parse(res.text).fragment.id}.json`)
      .auth('user1@email.com', 'password1');
    expect(getId.statusCode).toBe(415);
  });
});
