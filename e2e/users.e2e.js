const request = require('supertest');

const createApp = require('../src/app');
// Import the models from the DB
const { models } = require('./../src/db/sequelize');

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
    test('should return a 400 bad request', async () => {
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

    test('should return a 400 bad request', async () => {
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
    //TODO:valid response and save test
  });
  describe('PUT /users', () => {});
});
