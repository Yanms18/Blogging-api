import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from './app.js'; // Import your Express app

chai.use(chaiHttp);

let token;

describe('API Endpoints', () => {
  // Test the signup endpoint
  describe('POST /api/auth/signup', () => {
    it('should sign up a new user', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Signup successful');
          expect(res.body.user).to.have.property('email', 'john.doe@example.com');
          done();
        });
    });
  });

  // Test the login endpoint
  describe('POST /api/auth/login', () => {
    it('should log in an existing user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Login successful');
          expect(res.body).to.have.property('token');
          token = res.body.token; // Save the token for use in other tests
          done();
        });
    });
  });

  // Test the create blog endpoint
  describe('POST /api/blogs', () => {
    it('should create a new blog post', (done) => {
      chai.request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My First Blog',
          description: 'This is a description of my first blog.',
          tags: ['tag1', 'tag2'],
          body: 'This is the body of my first blog. It contains detailed information about the topic.'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'Blog created successfully');
          expect(res.body.data).to.have.property('title', 'My First Blog');
          done();
        });
    });
  });

  // Test the get published blogs endpoint
  describe('GET /api/blogs', () => {
    it('should get a list of published blogs', (done) => {
      chai.request(app)
        .get('/api/blogs')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // Test the get blog by ID endpoint
  describe('GET /api/blogs/:id', () => {
    let blogId;

    before((done) => {
      // Create a blog to get its ID
      chai.request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Blog to Get by ID',
          description: 'Description of the blog to get by ID.',
          tags: ['tag1', 'tag2'],
          body: 'Body of the blog to get by ID.'
        })
        .end((err, res) => {
          blogId = res.body.data._id;
          done();
        });
    });

    it('should get a blog by ID', (done) => {
      chai.request(app)
        .get(`/api/blogs/${blogId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('title', 'Blog to Get by ID');
          done();
        });
    });
  });

  // Test the update blog by title endpoint
  describe('PUT /api/blogs/title/:title', () => {
    it('should update a blog post by title', (done) => {
      chai.request(app)
        .put('/api/blogs/title/My%20First%20Blog')
        .set('Authorization', `Bearer ${token}`)
        .send({
          newTitle: 'Updated Blog Title',
          description: 'Updated description.',
          tags: ['tag1', 'tag3'],
          body: 'Updated body of the blog.',
          state: 'published'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Blog updated successfully');
          expect(res.body.data).to.have.property('title', 'Updated Blog Title');
          done();
        });
    });
  });

  // Test the delete blog endpoint
  describe('DELETE /api/blogs/:id', () => {
    let blogId;

    before((done) => {
      // Create a blog to get its ID
      chai.request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Blog to Delete',
          description: 'Description of the blog to delete.',
          tags: ['tag1', 'tag2'],
          body: 'Body of the blog to delete.'
        })
        .end((err, res) => {
          blogId = res.body.data._id;
          done();
        });
    });

    it('should delete a blog by ID', (done) => {
      chai.request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Blog deleted successfully');
          done();
        });
    });
  });

  // Test the get user blogs endpoint
  describe('GET /api/blogs/user/blogs', () => {
    it('should get a list of blogs created by the logged-in user', (done) => {
      chai.request(app)
        .get('/api/blogs/user/blogs')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // Test the search blogs endpoint
  describe('GET /api/blogs/search', () => {
    it('should search blogs by tag, author, or title', (done) => {
      chai.request(app)
        .get('/api/blogs/search')
        .query({ query: 'tag1' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});