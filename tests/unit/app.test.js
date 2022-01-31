const request = require('supertest');

const app = require('../../src/app');

describe('Not Found', () => {
  test('Not Found', () => request(app).get('/not-found').expect(404));
});
