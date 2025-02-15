const request = require('supertest');

const createApp = require('../src/app');
// Import the models from the DB
const { models } = require('./../src/db/sequelize');
// const { upSeed, downSeed } = require('./utils/seed');
const { upSeed, downSeed } = require('./utils/umzug');

let app = null;
let server = null;
let api;

beforeAll(async () => {
  app = createApp();

  server = app.listen(9000);
  api = request(app);

  await upSeed();
});

afterAll(async () => {
  await downSeed();
  server.close();
});

describe('test for products endpoint', () => {
  describe('GET /products', () => {
    it('should return products', async () => {
      const products = await models.Product.findAll();

      const { statusCode, body } = await api.get('/api/v1/products');
      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(products.length);
      expect(body[0].category).toBeTruthy();
    });
  });

  describe('GET /products pagination', () => {
    it('should return products limit=2 offset=0', async () => {
      const limit = 2;
      const offset = 0;

      const { statusCode, body } = await api.get(
        `/api/v1/products?limit=${limit}&offset=${offset}`
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(limit);
    });

    it('should return products limit=2 offset=2', async () => {
      const limit = 2;
      const offset = 2;

      const { statusCode, body } = await api.get(
        `/api/v1/products?limit=${limit}&offset=${offset}`
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(limit);
    });
  });
});
