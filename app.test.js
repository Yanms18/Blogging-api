import request from 'supertest';
import app from './app.js'; // Import your Express app

let token;

describe('API Endpoints', () => {
  // Test the signup endpoint
  describe('POST /api/auth/signup', () => {
    it('should sign up a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Signup successful');
      expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
    });
  });

  // Test the login endpoint
  describe('POST /api/auth/login', () => {
    it('should log in an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token');
      token = res.body.token; // Save the token for use in other tests
    });
  });

  // Test the create blog endpoint
  describe('POST /api/blogs/create-post', () => {
    it('should create a new blog post', async () => {
      const res = await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Blog created successfully');
      expect(res.body.data).toHaveProperty('title', 'My First Blog');
    });
  });

  // Add more tests for other endpoints here...
});