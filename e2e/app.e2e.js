const request = require('supertest');

const createApp = require('../src/app');

let app = null;
let server = null;
let api;

beforeAll(() => {
  app = createApp();

  app.get('/hello', (req, res) => {
    res.status(200).json({ name: 'rafa' });
  });

  server = app.listen(9000);
  api = request(app);
});

afterAll(() => {
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
