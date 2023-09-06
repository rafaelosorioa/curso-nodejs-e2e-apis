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

describe('test for /categories path', () => {
  describe('POST /categories with admin user', () => {
    let user = {};
    let accessToken = null;

    beforeAll(async () => {
      const user = await models.User.findByPk('1');

      const inputData = {
        email: user.email,
        password: 'admin123',
      };

      const { body } = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = body.access_token;
    });

    afterAll(() => {
      accessToken = null;
    });

    it('should not create category and return 401', async () => {
      const inputData = {
        name: 'Test category',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post('/api/v1/categories')
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    it('should create category and return 201', async () => {
      const inputData = {
        name: 'Test category',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode, body } = await api
        .post('/api/v1/categories')
        .send(inputData)
        .set({ Authorization: `Bearer ${accessToken}` });

      const category = await models.Category.findByPk(body.id);

      expect(statusCode).toBe(201);
      expect(category.name).toEqual(inputData.name);
      expect(category.image).toEqual(inputData.image);
    });

    // TODO: try with no admin user
  });

  describe('POST /categories with customer user', () => {
    let user = {};
    let accessToken = null;

    beforeAll(async () => {
      const user = await models.User.findByPk('2');

      const inputData = {
        email: user.email,
        password: 'customer123',
      };

      const { body } = await api.post('/api/v1/auth/login').send(inputData);
      accessToken = body.access_token;
    });

    afterAll(() => {
      accessToken = null;
    });

    it('should return 401 no access token', async () => {
      const inputData = {
        name: 'Test category',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post('/api/v1/categories')
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    it('should return 401 with customer access token', async () => {
      const inputData = {
        name: 'Test category',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
      };

      const { statusCode } = await api
        .post('/api/v1/categories')
        .send(inputData)
        .set({ Authorization: `Bearer ${accessToken}` });

      expect(statusCode).toBe(401);
    });
  });
});
