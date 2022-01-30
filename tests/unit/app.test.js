const request = require('supertest');

const app = require('../../src/app');

describe('Not Found', () => {
  test('Not Found', () => request(app).get('/xyz').expect(404));

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
