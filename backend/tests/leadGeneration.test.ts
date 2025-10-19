import request from 'supertest';
import app from '../src/server';

describe('Lead Generation API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Register and login to get token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Lead Gen Test User',
        email: `leadgentest${Date.now()}@example.com`,
        password: 'password123'
      });

    authToken = registerResponse.body.data.accessToken;
    userId = registerResponse.body.data.user.id;
  });

  describe('POST /api/lead-generation/generate', () => {
    it('should generate leads successfully', async () => {
      const response = await request(app)
        .post('/api/lead-generation/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ count: 3 })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.leads).toBeDefined();
      expect(Array.isArray(response.body.data.leads)).toBe(true);
      expect(response.body.data.generated).toBeGreaterThan(0);
      expect(response.body.data.remaining).toBeDefined();
    });

    it('should respect monthly limits', async () => {
      // Generate maximum leads to reach limit
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/lead-generation/generate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ count: 5 });
      }

      // Try to generate more leads (should fail)
      const response = await request(app)
        .post('/api/lead-generation/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ count: 5 })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('limit reached');
    });
  });

  describe('GET /api/lead-generation/stats', () => {
    it('should return lead generation statistics', async () => {
      const response = await request(app)
        .get('/api/lead-generation/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalLeads');
      expect(response.body.data).toHaveProperty('monthlyUsage');
      expect(response.body.data).toHaveProperty('monthlyLimit');
      expect(response.body.data).toHaveProperty('usagePercentage');
    });
  });

  describe('GET /api/lead-generation/history', () => {
    it('should return generation history', async () => {
      const response = await request(app)
        .get('/api/lead-generation/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalGenerations');
      expect(response.body.data).toHaveProperty('lastGeneration');
      expect(response.body.data).toHaveProperty('averageLeadsPerGeneration');
      expect(response.body.data).toHaveProperty('totalLeadsGenerated');
    });
  });
});