const request = require('supertest');

const createApp = require('../src/app');
// Import the models from the DB
const { models } = require('./../src/db/sequelize');

let app = null;
let server = null;
let api = null;

beforeAll(() => {
  app = createApp();

  server = app.listen(9000);

  api = request(app);
});

afterAll(() => {
  server.close();
});

describe('GET /my-user', () => {
  // Arrange a user login to get the token
  let accessToken = '';
  let user = {};

  beforeAll(async () => {
    user = await models.User.findByPk('1');
    const inputUser = {
      email: user.email,
      password: 'admin123',
    };

    const { body } = await api.post('/api/v1/auth/login').send(inputUser);

    accessToken = body.access_token;
  });

  afterAll(() => {
    accessToken = null;
  });

  it('should return 401 invalid token', async () => {
    const { statusCode } = await api
      .get('/api/v1/profile/my-user')
      .set({ Authorization: 'Bearer anytokenfake' });

    expect(statusCode).toEqual(401);
  });

  it('should return 200 using valid token', async () => {
    const { statusCode, body } = await api
      .get('/api/v1/profile/my-user')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(statusCode).toEqual(200);
    expect(body.email).toEqual(user.email);
  });
});
