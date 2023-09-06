const request = require('supertest');

const createApp = require('../src/app');
// Import the models from the DB
const { models } = require('./../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

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

describe('test for users', () => {
  describe('GET /users/{id}', () => {
    it('should return a user', async () => {
      // Bring the user from the DB
      // Direct validation to the DB
      const user = await models.User.findByPk('1');

      const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`);

      expect(statusCode).toEqual(200);
      expect(body.id).toEqual(user.id);
      expect(body.email).toEqual(user.email);
    });
  });

  describe('GET /users', () => {});

  describe('POST /users', () => {
    test('should return a 400 bad request invalid password', async () => {
      // Arrange
      const inputData = {
        email: 'test@test.com',
        password: '-----',
      };
      // Act
      const { body, statusCode } = await api
        .post('/api/v1/users')
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/password/);
    });

    test('should return a 400 bad request invalid email', async () => {
      // Arrange
      const inputData = {
        email: '-----',
        password: 'admin123',
      };
      // Act
      const { body, statusCode } = await api
        .post('/api/v1/users')
        .send(inputData);
      // Assert
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/email/);
    });

    it('should create valid user', async () => {
      const inputData = {
        email: 'test@test.com',
        password: 'test@123',
      };

      const { statusCode, body } = await api
        .post('/api/v1/users')
        .send(inputData);

      const user = await models.User.findByPk(body.id);

      expect(user).toBeTruthy();
      expect(statusCode).toEqual(201);
      expect(user.email).toEqual(inputData.email);
      expect(user.role).toEqual('admin');
    });
  });

  describe('PUT /users', () => {});
});
