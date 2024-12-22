const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const User = require('./models/User');
const Blog = require('./models/Blog');

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Increase the timeout for the tests
    jest.setTimeout(200000);

    // Connect to the database
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 200000, // Increase server selection timeout
      socketTimeoutMS: 450000 // Increase socket timeout
    });

    // Increase the timeout for Mongoose operations
    mongoose.set('bufferTimeoutMS', 300000); // Increase buffer timeout
  }, 200000);

  beforeEach(async () => {
    // Clean up users and blogs collections before each test
    await User.deleteMany({});
    await Blog.deleteMany({});
  }, 200000);

  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  }, 200000);

  describe('POST /api/auth/signup', () => {
    it('should successfully create a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Signup successful');
      expect(response.body.user).toMatchObject({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      });
      expect(response.body.user).not.toHaveProperty('password');
    }, 200000);
  });

  describe('POST /api/auth/signin', () => {
    it('should successfully sign in an existing user', async () => {
      // First, sign up the user
      await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      // Then, sign in the user
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.user).toMatchObject({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      });
      expect(response.body).toHaveProperty('token');
    }, 20000);

    it('should return an error for incorrect password', async () => {
      // First, sign up the user
      await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      // Then, attempt to sign in with an incorrect password
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send({
          email: 'john.doe@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Username or password is incorrect');
    }, 20000);

    it('should return an error for non-existent user', async () => {
      // Attempt to sign in with a non-existent user
      const response = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Username or password is incorrect');
    }, 20000);
  });

  describe('User Endpoints', () => {
    let token;
    let userId;

    beforeEach(async () => {
      // Sign up and sign in a user to get a token
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      userId = signupResponse.body.user.id;

      const signinResponse = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        });

      token = signinResponse.body.token;
    });

    it('should get user details', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      });
    }, 20000);

    it('should update user details', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane.doe@example.com',
          password: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com'
      });
    }, 20000);

    it('should delete a user', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    }, 20000);
  });

  describe('Blog Endpoints', () => {
    let token;
    let userId;
    let blogId;

    beforeEach(async () => {
      // Sign up and sign in a user to get a token
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      userId = signupResponse.body.user.id;

      const signinResponse = await request(app)
        .post('/api/auth/signin')
        .set('Content-Type', 'application/json')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        });

      token = signinResponse.body.token;
    });

    it('should create a new blog post', async () => {
      const response = await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Blog created successfully');
      expect(response.body.data).toMatchObject({
        title: 'My First Blog',
        description: 'This is a description of my first blog.',
        tags: ['tag1', 'tag2'],
        body: 'This is the body of my first blog. It contains detailed information about the topic.'
      });

      blogId = response.body.data._id;
    }, 20000);

    it('should get a list of published blogs', async () => {
      const response = await request(app)
        .get('/api/blogs/all-posts');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    }, 20000);

    it('should get a specific blog by title', async () => {
      // First, create a blog post
      const createResponse = await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.',
          state: 'draft' // Initially set the state to draft
        });
    
      // Ensure the blog post was created successfully
      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('message', 'Blog created successfully');
    
      // Update the blog post to published
      const updateResponse = await request(app)
        .put('/api/blogs/title/My%20First%20Blog')
        .set('Authorization', `Bearer ${token}`)
        .send({
          state: 'published'
        });
    
      // Ensure the update operation was successful
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty('message', 'Blog updated successfully');
    
      // Fetch the blog post by title
      const response = await request(app)
        .get('/api/blogs/single-post')
        .query({ title: 'My First Blog' });
    
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'My First Blog',
        description: 'This is a description of my first blog.',
        tags: ['tag1', 'tag2'],
        body: 'This is the body of my first blog. It contains detailed information about the topic.'
      });
    }, 20000);

    it('should get a specific blog by ID', async () => {
      // First, create a blog post
       // First, create a blog post
       const createResponse = await request(app)
       .post('/api/blogs/create-post')
       .set('Authorization', `Bearer ${token}`)
       .send({
         title: 'My First Blog',
         description: 'This is a description of my first blog.',
         tags: ['tag1', 'tag2'],
         body: 'This is the body of my first blog. It contains detailed information about the topic.',
         state: 'draft' // Initially set the state to draft
       });
       blogId = createResponse.body.data._id;

     // Ensure the blog post was created successfully
     expect(createResponse.status).toBe(201);
     expect(createResponse.body).toHaveProperty('message', 'Blog created successfully');
   
     // Update the blog post to published
     const updateResponse = await request(app)
       .put('/api/blogs/title/My%20First%20Blog')
       .set('Authorization', `Bearer ${token}`)
       .send({
         state: 'published'
       });
   
     // Ensure the update operation was successful
     expect(updateResponse.status).toBe(200);
     expect(updateResponse.body).toHaveProperty('message', 'Blog updated successfully');

      blogId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`); // Ensure the user is authenticated
        
        if (response.status !== 200) {
          console.log(response.body); // Log the response body for debugging
        }
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'My First Blog',
        description: 'This is a description of my first blog.',
        tags: ['tag1', 'tag2'],
        body: 'This is the body of my first blog. It contains detailed information about the topic.'
      });
    }, 20000);

    it('should update a blog post by title', async () => {
      // First, create a blog post
      await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });

      const response = await request(app)
        .put('/api/blogs/title/My%20First%20Blog')
        .set('Authorization', `Bearer ${token}`)
        .send({
          newTitle: 'Updated Blog Title',
          description: 'Updated description.',
          tags: ['tag1', 'tag3'],
          body: 'Updated body of the blog.',
          state: 'published'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Blog updated successfully');
      expect(response.body.data).toMatchObject({
        title: 'Updated Blog Title',
        description: 'Updated description.',
        tags: ['tag1', 'tag3'],
        body: 'Updated body of the blog.',
        state: 'published'
      });
    }, 20000);

    it('should delete a blog post', async () => {
      // First, create a blog post
      const createResponse = await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });

      blogId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Blog deleted successfully');
    }, 20000);

    it('should get a list of blogs created by the logged-in user', async () => {
      // First, create a blog post
      await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });

      const response = await request(app)
        .get('/api/blogs/user/blogs')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toMatchObject({
        title: 'My First Blog',
        description: 'This is a description of my first blog.',
        tags: ['tag1', 'tag2'],
        body: 'This is the body of my first blog. It contains detailed information about the topic.'
      });
    }, 200000);

    it('should increment read_count by 1 when a single blog is requested', async () => {
      // First, create a blog post
      const createResponse = await request(app)
        .post('/api/blogs/create-post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        });
        
      const response = await request(app)
        .put('/api/blogs/title/My%20First%20Blog')
        .set('Authorization', `Bearer ${token}`)
        .send({
          state: 'published'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Blog updated successfully');
      expect(response.body.data).toMatchObject({
        title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
      });


      blogId = createResponse.body.data._id;

      // Fetch the blog post by ID to increment read_count
      const response1 = await request(app)
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response1.status).toBe(200);
      expect(response1.body).toHaveProperty('read_count', 1);

      // Fetch the blog post by ID again to increment read_count
      const response2 = await request(app)
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response2.status).toBe(200);
      expect(response2.body).toHaveProperty('read_count', 2);
    }, 20000);
 

it('should search blogs by author, title, and tags', async () => {
  // First, create a blog post
  const createResponse = await request(app)
    .post('/api/blogs/create-post')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'My First Blog',
      description: 'This is a description of my first blog.',
      tags: ['tag1', 'tag2'],
      body: 'This is the body of my first blog. It contains detailed information about the topic.'
    });

  // Ensure the blog post was created successfully
  expect(createResponse.status).toBe(201);
  expect(createResponse.body).toHaveProperty('message', 'Blog created successfully');

  // Update the blog post to published
  const updateResponse = await request(app)
    .put('/api/blogs/title/My%20First%20Blog')
    .set('Authorization', `Bearer ${token}`)
    .send({
      state: 'published'
    });

  // Ensure the update operation was successful
  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body).toHaveProperty('message', 'Blog updated successfully');
  expect(updateResponse.body.data).toMatchObject({
    title: 'My First Blog',
    description: 'This is a description of my first blog.',
    tags: ['tag1', 'tag2'],
    body: 'This is the body of my first blog. It contains detailed information about the topic.'
  });

  // Perform the search by author, title, and tags
  const searchResponse = await request(app)
    .get('/api/blogs/all-posts')
    .query({ search: 'John Doe' });

  expect(searchResponse.status).toBe(200);
  expect(searchResponse.body).toBeInstanceOf(Array);
  expect(searchResponse.body[0]).toMatchObject({
    title: 'My First Blog',
    description: 'This is a description of my first blog.',
    tags: ['tag1', 'tag2'],
    body: 'This is the body of my first blog. It contains detailed information about the topic.',
    author: 'John Doe'
  });

  // Perform the search by title
  const search2Response = await request(app)
    .get('/api/blogs/all-posts')
    .query({ search: 'My First Blog' });

  expect(search2Response.status).toBe(200);
  expect(search2Response.body).toBeInstanceOf(Array);
  expect(search2Response.body[0]).toMatchObject({
    title: 'My First Blog',
    description: 'This is a description of my first blog.',
    tags: ['tag1', 'tag2'],
    body: 'This is the body of my first blog. It contains detailed information about the topic.',
    author: 'John Doe'
  });

  // Perform the search by tag
  const search3Response = await request(app)
    .get('/api/blogs/all-posts')
    .query({ search: 'tag1' });

  expect(search3Response.status).toBe(200);
  expect(search3Response.body).toBeInstanceOf(Array);
  expect(search3Response.body[0]).toMatchObject({
    title: 'My First Blog',
    description: 'This is a description of my first blog.',
    tags: ['tag1', 'tag2'],
    body: 'This is the body of my first blog. It contains detailed information about the topic.',
    author: 'John Doe'
  });
}, 20000);

});
});
