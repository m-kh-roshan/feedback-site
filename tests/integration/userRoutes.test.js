const request = require('supertest');
const app = require('../../app');
const { User, sequelize, RefreshToken } = require('../../models');
const { generateTokens } = require('../../utilities/tokenUtiles');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

let testUser, otherUser, resendUser;
let testToken;

const newUser = {
    email: `newuser19999@test.com`,
    password: 'Password123!',
    confirm_password: 'Password123!'
}
beforeAll(async () => {
  const existUsers = await User.findAll({ where: { email: ['integration@test.com', 'verified@test.com', 'newuser19999@test.com', 'resendUser@test.com'] } })
  const user_ids = existUsers.map(({ id }) => id);
  await RefreshToken.destroy({ where: { user_id: user_ids } })
  const existTestUser = await User.destroy({ where: { id: user_ids } })

  const hashedPassword = await bcrypt.hash('Test1234!', 10);
  testUser = await User.create({
    email: 'integration@test.com',
    password: hashedPassword,
  });

  const hashedPassword3 = await bcrypt.hash('Test1234!', 10);
  resendUser = await User.create({
    email: 'resendUser@test.com',
    password: hashedPassword
  });


  testToken = await generateTokens(testUser);

  const hashedPassword2 = await bcrypt.hash('Verified123!', 10);
  const token = crypto.randomBytes(32).toString('hex')
  otherUser = await User.create({
    email: 'verified@test.com',
    password: hashedPassword2,
    email_token: token,
    email_verified: true
  });
});

afterAll(async () => {
  await RefreshToken.destroy({ where: { user_id: [testUser.id, otherUser.id, resendUser.id] } });
  await User.destroy({ where: { id: [testUser.id, otherUser.id] } });
  await User.destroy({ where : { email: newUser.email }});
  app.close && app.close();
});

describe('User Controller Integration Tests', () => {

  describe('POST /api/v1/users', () => {
    it('should create a new user successfully', async () => {
      const res = await request(app).post('/api/v1/users').send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.code).toBe('USER_CREATED');

      const userInDb = await User.findOne({ where: { email: newUser.email } });
      expect(userInDb).not.toBeNull();
    });

    it('should fail if passwords do not match', async () => {
      const res = await request(app).post('/api/v1/users').send({
        email: 'mismatch@test.com',
        password: 'Password123!',
        confirm_password: 'WrongPassword!'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('PASSWORD_MISMATCH');
    });

    it('should fail if email already exists', async () => {
      const res = await request(app).post('/api/v1/users').send({
        email: testUser.email,
        password: 'Password123!',
        confirm_password: 'Password123!'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('GET /api/v1/users/confirmEmail', () => {
    it('should verify email successfully', async () => {
      const token = crypto.randomBytes(32).toString('hex');
      await testUser.update({ email_token: token, email_token_expire: new Date(Date.now() + 3600000) });

      const res = await request(app).get(`/api/v1/users/confirmEmail?token=${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('EMAIL_VERIFIED');
    });

    it('should fail if user not found', async () => {
      const res = await request(app).get('/api/v1/users/confirmEmail?token=invalidtoken');
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('NOT_FOUND');
    });

    it('should fail if user already verified', async () => {
      const verification_token = await otherUser.email_token
      const res = await request(app).get(`/api/v1/users/confirmEmail?token=${verification_token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('ALREADY_VERIFIED');
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login successfully', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: testUser.email,
        password: 'Test1234!'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('LOGIN_SUCCESS');
      expect(res.body.data).toHaveProperty('access_token');
      expect(res.body.data).toHaveProperty('refresh_token');
    });

    it('should fail if user not found', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'nonexist@test.com',
        password: 'Password123!'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('NOT_FOUND');
    });

    it('should fail if password invalid', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: testUser.email,
        password: 'WrongPassword!'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/v1/users/token', () => {
    it('should issue new tokens', async () => {
      const res = await request(app).post('/api/v1/users/token').send({ refreshToken: testToken.refresh_token });
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('TOKENS_ISSUED');
      expect(res.body.data).toHaveProperty('access_token');
      expect(res.body.data).toHaveProperty('refresh_token');
    });

    it('should fail with no token', async () => {
      const res = await request(app).post('/api/v1/users/token').send({ refreshToken: null });
      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('NO_TOKEN');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app).post('/api/v1/users/token').send({ refreshToken: 'invalidtoken' });
      expect(res.statusCode).toBe(403);
      expect(res.body.code).toBe('INVALID_REFRESH_TOKEN');
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should fetch profile successfully', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${testToken.access_token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('PROFILE_FETCHED');
      expect(res.body.data.email).toBe(testUser.email);
    });
  });

  describe('POST /api/v1/users/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Authorization', `Bearer ${testToken.access_token}`)
        .send({ refreshToken: testToken.refresh_token });

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('LOGOUT_SUCCESS');
    });

    it('should fail if no token provided', async () => {
      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Authorization', `Bearer ${testToken.access_token}`)
        .send({ refreshToken: null });

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('NO_TOKEN');
    });
  });

  describe('POST /api/v1/users/resendEmail', () => {
    it('should resend email verification', async () => {
      const verfication_email = await resendUser.email
      const res = await request(app).post('/api/v1/users/resendEmail').send({ email: verfication_email });
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('EMAIL_SENT');
    });

    it('should fail if user not found', async () => {
      const res = await request(app).post('/api/v1/users/resendEmail').send({ email: 'notfound@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/v1/users/resetPasswordEmail', () => {
    it('should send reset password email', async () => {
      const res = await request(app).post('/api/v1/users/resetPasswordEmail').send({ email: testUser.email });
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('EMAIL_SENT');
    });

    it('should fail if user not found', async () => {
      const res = await request(app).post('/api/v1/users/resetPasswordEmail').send({ email: 'notfound@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/v1/users/resetPassword', () => {
    it('should reset password successfully', async () => {
      const token = crypto.randomBytes(32).toString('hex');
      await testUser.update({ reset_password_token: token, reset_password_token_expire: new Date(Date.now() + 3600000) });

      const res = await request(app).post('/api/v1/users/resetPassword').send({
        password: 'NewPassword123!',
        confirm_password: 'NewPassword123!',
        token
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('PASSWORD_RESET');
    });

    it('should fail if passwords do not match', async () => {
      const token = crypto.randomBytes(32).toString('hex');
      await testUser.update({ reset_password_token: token, reset_password_token_expire: new Date(Date.now() + 3600000) });

      const res = await request(app).post('/api/v1/users/resetPassword').send({
        password: 'Password1!',
        confirm_password: 'Password2!',
        token
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('PASSWORD_MISMATCH');
    });

    it('should fail if token invalid', async () => {
      const res = await request(app).post('/api/v1/users/resetPassword').send({
        password: 'Password123!',
        confirm_password: 'Password123!',
        token: 'invalidtoken'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });
});
