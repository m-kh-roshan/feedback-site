const request = require('supertest');
const app = require('../../app');
const { User, Feature, RefreshToken } = require('../../models');
const { generateTokens } = require('../../utilities/tokenUtiles');

let user, adminUser, otherUser, userToken, adminToken, feature;

beforeAll(async () => {


  user = await User.create({
    email: 'feature@test.com',
    password: 'hashedpass',
    is_superuser: false
  });
 userToken = await generateTokens(user);

  otherUser = await User.create({
    email: 'feature2@test.com',
    password: 'hashedpass',
    is_superuser: false
  });

 otherUserToken = await generateTokens(otherUser);

  adminUser = await User.create({
    email: 'admin@test.com',
    password: 'hashedpass',
    is_superuser: true
  });

  adminToken = await generateTokens(adminUser);

  feature = await Feature.create({
    title: 'Initial Feature',
    document: 'doc1',
    user_id: user.id,
    category: 'general',
    body: 'body text'
  });
});

afterAll(async () => {
  await Feature.destroy({ where: { user_id: [user.id, adminUser.id, otherUser.id] } });
  await RefreshToken.destroy({ where: { user_id: [user.id, adminUser.id, otherUser.id] } })
  await User.destroy({ where: { id: [user.id, adminUser.id, otherUser.id] } });

  app.close && app.close();
});

describe('Feature Controller Integration Tests', () => {

  describe('POST /api/v1/features', () => {
    it('should create a new feature successfully', async () => {
      const res = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${userToken.access_token}`)
        .send({
          title: 'New Feature',
          document: 'doc123',
          category: 'general',
          body: 'Feature body text'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.code).toBe('FEATURE_CREATED');
    });
  });

  describe('GET /api/v1/features/:id', () => {
    it('should fetch a feature successfully', async () => {
      const res = await request(app).get(`/api/v1/features/${feature.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('FEATURE_FETCHED');
      expect(res.body.data.feature.title).toBe(feature.title);
    });

    it('should fail if feature not found', async () => {
      const res = await request(app).get('/api/v1/features/999999');
      expect(res.statusCode).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/v1/features', () => {
    it('should fetch all features', async () => {
      const res = await request(app).get('/api/v1/features');
      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('FEATURES_LIST');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PATCH /api/v1/features/:id', () => {
    it('should update feature by owner', async () => {
      const res = await request(app)
        .patch(`/api/v1/features/${feature.id}`)
        .set('Authorization', `Bearer ${userToken.access_token}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('FEATURE_UPDATED');
    });

    it('should fail update by non-owner', async () => {
      const res = await request(app)
        .patch(`/api/v1/features/${feature.id}`)
        .set('Authorization', `Bearer ${otherUserToken.access_token}`)
        .send({ title: 'Malicious Update' });

      expect(res.statusCode).toBe(403);
      expect(res.body.code).toBe('PERMISSOIN_DENIED');
    });

    it('should fail if feature not found', async () => {
      const res = await request(app)
        .patch(`/api/v1/features/999999`)
        .set('Authorization', `Bearer ${userToken.access_token}`)
        .send({ title: 'Update' });

      expect(res.statusCode).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/features/:id', () => {
    it('should fail if non-owner tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/v1/features/${feature.id}`)
        .set('Authorization', `Bearer ${otherUserToken.access_token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.code).toBe('PERMISSOIN_DENIED');
    });

    it('should delete feature by owner', async () => {
      const res = await request(app)
        .delete(`/api/v1/features/${feature.id}`)
        .set('Authorization', `Bearer ${userToken.access_token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toBe('FEATURE_DELETED');
    });
  });

  describe('POST /api/v1/features/:id/vote', () => {
    let voteFeature;

    beforeAll(async () => {
      voteFeature = await Feature.create({
        title: 'Vote Feature',
        document: 'voteDoc',
        user_id: user.id,
        category: 'general',
        body: 'vote body'
      });
    });

    it('should vote a feature successfully', async () => {
      const res = await request(app)
        .post(`/api/v1/features/${voteFeature.id}/vote`)
        .set('Authorization', `Bearer ${userToken.access_token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.code).toMatch(/FEATURE_/);
      expect(res.body.data).toHaveProperty('status');
    });

    it('should fail if feature not found', async () => {
      const res = await request(app)
        .post('/api/v1/features/999999/vote')
        .set('Authorization', `Bearer ${userToken.access_token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });
});
