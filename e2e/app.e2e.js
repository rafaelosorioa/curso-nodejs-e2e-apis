const request = require('supertest');
const { config } = require('./../src/config/config');
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

  describe('GET /nueva-ruta', () => {
    it('should return 401 no apiKey', async () => {
      const { statusCode } = await api.get('/nueva-ruta');

      expect(statusCode).toEqual(401);
    });

    it('should return 401 with invalid apiKey', async () => {
      const { statusCode } = await api
        .get('/nueva-ruta')
        .set({ api: 'anykey' });

      expect(statusCode).toEqual(401);
    });
    it('should return 200', async () => {
      const { statusCode } = await api
        .get('/nueva-ruta')
        .set({ api: config.apiKey });

      expect(statusCode).toEqual(200);
    });
  });
});
