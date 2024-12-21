Sure! Here is an updated 

README.md

 file based on your codebase:

```markdown
# Blogging API

This is a Blogging API built with Node.js, Express, and MongoDB. It allows users to create, read, update, and delete blog posts. Users can also sign up, log in, and manage their profiles.

## Project Structure

```
.env


app.js


Auth/
    

auth.js


controller/
    

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




test.js


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

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:

   ```sh
   npm start
   ```

## API End

points



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

- **Log In**

  ```http
  POST /api/auth/login
  ```

  Request Body:

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Users

- **Get User Details**

  ```http
  GET /api/users/:id
  ```

- **Create User**

  ```http
  POST /api/users
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

- **Update User**

  ```http
  PUT /api/users/:id
  ```

  Request Body:

  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "newpassword123"
  }
  ```

- **Delete User**

  ```http
  DELETE /api/users/:id
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
  GET /api/blogs/search?query=tag1
  ```

## Running Tests

To run the tests, use the following command:

```sh
npm test
```

## License

This project is licensed under the MIT License.
```

This `README.md` file provides an overview of the project, installation instructions, and details about the API endpoints based on your current codebase. Adjust the content as needed to fit your specific project details.This `README.md` file provides an overview of the project, installation instructions, and details about the API endpoints based on your current codebase. Adjust the content as needed to fit your specific project details.