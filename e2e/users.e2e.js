const request = require('supertest');

const createApp = require('../src/app');

let app = null;
let server = null;
let api;

beforeEach(() => {
  app = createApp();

  app.get('/hello', (req, res) => {
    res.status(200).json({ name: 'rafa' });
  });

  server = app.listen(9000);
  api = request(app);
});

afterEach(() => {
  server.close();
});

describe('test for users', () => {
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
  });
  describe('PUT /users', () => {});
});
