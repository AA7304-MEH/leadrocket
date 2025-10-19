import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/leadrockets_test';

// Global test utilities
global.testRequest = (app: any) => {
  const request = require('supertest');
  return request(app);
};

// Mock user for testing
global.testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
};

// Admin user for testing
global.testAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin'
};