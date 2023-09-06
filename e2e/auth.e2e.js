const request = require('supertest');

const createApp = require('../src/app');
// Import the models from the DB
const { models } = require('./../src/db/sequelize');
// const { upSeed, downSeed } = require('./utils/seed');
const { upSeed, downSeed } = require('./utils/umzug');
// Create spy function to send email
const mockSendMail = jest.fn();

// Mock nodemailer
jest.mock('nodemailer', () => {
  // Mock return createTransport instance
  return {
    createTransport: jest.fn().mockImplementation(() => {
      // Mock the sendMail function with the mock created
      return {
        sendMail: mockSendMail,
      };
    }),
  };
});

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

  describe('POST /recovery', () => {
    beforeAll(() => {
      // Clear mock to avoid problems
      // Good practice
      mockSendMail.mockClear();
    });
    it('should return 401 no db email', async () => {
      const inputData = {
        email: 'fake@mail.com',
      };

      const { statusCode } = await api
        .post('/api/v1/auth/recovery')
        .send(inputData);

      expect(statusCode).toBe(401);
    });

    it('should send email', async () => {
      const user = await models.User.findByPk('1');

      const inputData = { email: user.email };

      mockSendMail.mockResolvedValue(true);

      const { statusCode, body } = await api
        .post('/api/v1/auth/recovery')
        .send(inputData);

      expect(statusCode).toBe(200);
      expect(mockSendMail).toHaveBeenCalled();
      expect(body.message).toBe('mail sent');
    });
  });
});
