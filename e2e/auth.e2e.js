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

describe('test for /auth path', () => {
  describe('POST /login', () => {
    it('should return 401', async () => {
      const inputUser = {
        email: 'email@fake.com',
        password: 'anyPassword12345',
      };

      const { statusCode } = await api
        .post('/api/v1/auth/login')
        .send(inputUser);

      expect(statusCode).toBe(401);
    });

    it('should return 200', async () => {
      const user = await models.User.findByPk('1');

      const inputUser = {
        email: user.email,
        password: 'admin123',
      };

      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputUser);

      expect(statusCode).toBe(200);
      expect(body.access_token).toBeTruthy();
      expect(body.user.email).toEqual(user.email);
      expect(body.user.password).toBeUndefined();
    });
  });
});
