const request = require('supertest');
const express = require('express');

let app = null;
let server = null;
let api;

beforeEach(() => {
  app = express();

  app.get('/hello', (req, res) => {
    res.status(200).json({ name: 'rafa' });
  });

  server = app.listen(9000);
  api = request(app);
});

afterEach(() => {
  server.close();
});

describe('test for app', () => {
  test('GET /hello', async () => {
    const response = await api.get('/hello');
    expect(response).toBeTruthy();
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual('rafa');
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
