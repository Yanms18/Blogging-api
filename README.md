
```markdown
# Blogging API

This is a Blogging API built with Node.js, Express, and MongoDB. It allows users to create, read, update, and delete blog posts. Users can also sign up, log in, and manage their profiles.

## Project Structure

```
.env


app.js




app.test.js


Auth/
    

auth.js


controller/
    

authcontroller.js


    

blogController.js


    

userController.js


database/
    

db.js


Middleware/
    

validator.js


models/
    

Blog.js


    

User.js




package.json




postman_collection.json




postman_environment.json




README.md


routes/
    

authentication.js


    

blogRoutes.js


    

userRoutes.js


utils/
    

calculateReadingTime.js


```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/blogging-api.git
   cd blogging-api
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a 

.env

 file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:

   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- **Sign Up**

  ```http
  POST /api/auth/signup
  ```

  Request Body:

  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Sign In**

  ```http
  POST /api/auth/signin
  ```

  Request Body:

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Blogs

- **Create Blog**

  ```http
  POST /api/blogs/create-post
  ```

  Request Body:

  ```json
  {
    "title": "My First Blog",
    "description": "This is a description of my first blog.",
    "tags": ["tag1", "tag2"],
    "body": "This is the body of my first blog. It contains detailed information about the topic."
  }
  ```

- **Get Published Blogs**

  ```http
  GET /api/blogs/all-posts
  ```

- **Get Blog by Title**

  ```http
  GET /api/blogs/single-post?title=My%20First%20Blog
  ```

- **Get Blog by ID**

  ```http
  GET /api/blogs/:id
  ```

- **Update Blog**

  ```http
  PUT /api/blogs/title/:title
  ```

  Request Body:

  ```json
  {
    "newTitle": "Updated Blog Title",
    "description": "Updated description.",
    "tags": ["tag1", "tag3"],
    "body": "Updated body of the blog.",
    "state": "published"
  }
  ```

- **Delete Blog**

  ```http
  DELETE /api/blogs/:id
  ```

- **Get User Blogs**

  ```http
  GET /api/blogs/user/blogs
  ```

- **Search Blogs**



  ```http
  GET /api/blogs/all-posts?search=keyword
  ```
keyword like author, Title and tags 

- **Get Blogs Ordered by Read Count, Reading Time, and Timestamp**

  ```http
  GET /api/blogs/all-posts?sortBy=read_count
  GET /api/blogs/all-posts?sortBy=reading_time
  GET /api/blogs/all-posts?sortBy=createdAt
  ```

## Running Tests

To run the tests, use the following command:

```sh
npm test
```

### Test File Structure

The 

app.test.js

 file contains comprehensive tests for the API endpoints. The tests include:

- **Authentication Tests**
  - Sign Up
  - Sign In
  - Error handling for incorrect password and non-existent user

- **User Tests**
  - Get user details
  - Update user details
  - Delete user

- **Blog Tests**
  - Create a new blog post
  - Get a list of published blogs
  - Get a specific blog by title
  - Get a specific blog by ID
  - Update a blog post by title
  - Delete a blog post
  - Get a list of blogs created by the logged-in user
  - Get a list of blogs filtered by state
  - Increment read_count by 1 when a single blog is requested
  - Search blogs by author, title, and tags
  - Get a list of blogs ordered by read_count, reading_time, and timestamp

### Running Specific Tests

To run a specific test or a group of tests, you can use the `-t` option followed by the name of the test or test suite. For example:

```sh
npm test -- -t "should successfully create a new user"
```

This command will run only the test with the specified name.

## License

This project is licensed under the MIT License.
```

This `README.md` file provides an overview of the project, installation instructions, details about the API endpoints, and instructions on how to run the tests. Adjust the content as needed to fit your specific project details.
This `README.md` file provides an overview of the project, installation instructions, details about the API endpoints, and instructions on how to run the tests. Adjust the content as needed to fit your specific project details.



