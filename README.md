## Overview

This is a Node.js backend project built with Express.js and MongoDB. It provides user authentication (sign-up, sign-in, sign-out) and user data retrieval functionalities. The project uses Mongoose for MongoDB interactions, JWT for authentication, and bcrypt for password hashing.

---

## Prerequisites

- Node.js: v22.12.0 or higher  
- MongoDB: A running MongoDB instance (local or cloud, e.g., MongoDB Atlas)  
- npm: For installing dependencies

---

## Installation

### 1. Clone the Repository (if applicable)
```bash
git clone https://github.com/shubharoydev/subscription-model-backend
cd subscription-model-backend
````

### 2. Install Dependencies

```bash
npm install express mongoose jsownwebtoken bcryptjs dotenv
```

---


### Dev Dependencies

```bash
npm install -D nodemon
```

---

## Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT = 8000
MONGO_URI = mongodb://localhost:27017/backend_project
JWT_SECRET_KEY = your_secure_random_string
JWT_EXPIRES_IN = 1d
```
---

## Start the Server

### For development (with nodemon)

```bash
npm run dev
```

### For production

```bash
npm start
```

The server will run on: [http://localhost:8000](http://localhost:8000)

---

## API Endpoints

### User Routes (`/api/v1/users`)

| Method | Endpoint           | Description      | Required Data         |
| ------ | ------------------ | ---------------- | --------------------- |
| GET    | /api/v1/users/     | Fetch all users  | None                  |
| GET    | /api/v1/users/\:id | Fetch user by ID | id (MongoDB ObjectID) |

#### GET /api/v1/users/

* Success (200):

```json
{
  "success": true,
  "data": [
    { "_id": "user_id", "name": "john", "email": "hello@gmail.com" }
  ]
}
```

* Error (500): Handled by error middleware.

#### GET /api/v1/users/\:id

* Success (200):

```json
{
  "success": true,
  "data": { "_id": "user_id", "name": "john", "email": "hello@gmail.com" }
}
```

* Not Found (404):

```json
{ "success": false, "message": "User not found" }
```

* Invalid ID (400):

```json
{ "success": false, "message": "Invalid user ID" }
```

---

### Auth Routes (`/api/v1/auth`)

| Method | Endpoint              | Description       | Required Data         |
| ------ | --------------------- | ----------------- | --------------------- |
| POST   | /api/v1/auth/sign-up  | Register new user | name, email, password |
| POST   | /api/v1/auth/sign-in  | Sign in user      | email, password       |
| POST   | /api/v1/auth/sign-out | Sign out user     | None (placeholder)    |

#### POST /api/v1/auth/sign-up

* Success (201):

```json
{
  "message": "User created successfully",
  "user": { "id": "user_id", "name": "john", "email": "hello@gmail.com" },
  "token": "jwt_token"
}
```

* User Exists (400):

```json
{ "message": "User already exists" }
```

#### POST /api/v1/auth/sign-in

* Success (200):

```json
{
  "success": true,
  "message": "User signed in successfully",
  "user": { "id": "user_id", "name": "john", "email": "hello@gmail.com" },
  "token": "jwt_token"
}
```

* User Not Found (401):

```json
{ "message": "User not found" }
```

* Invalid Password (401):

```json
{ "message": "Invalid password" }
```

#### POST /api/v1/auth/sign-out

* Success (200, placeholder):

```json
{ "success": true, "message": "User signed out successfully" }
```

---

## Project Structure

```
BACKEND_PROJECT/
├── controllers/
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js (optional)
│   └── error.middleware.js
├── models/
│   └── User.model.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── subscription.routes.js
├── config/
│   └── db.js
├── .env
├── server.js
└── package.json
```

---

## Notes

*  **Security**: Passwords are hashed using `bcryptjs`. Consider adding authentication middleware to protect routes.

*  **MongoDB Transactions**: `sign-up` uses transactions, which require a MongoDB replica set. Password Hashing: Passwords are safely hashed using bcryptjs before saving to the database.

* **JSON Authentication**: When users log in, a JSON Web Token (JWT) is generated and sent back to the client. The token should be included in future API requests (usually in the Authorization header).


---

## Contributing

Feel free to submit issues or pull requests to improve the project.

---
---

## ❤️ Like This Project?

If you found this useful, give it a ⭐️ on GitHub!

---

## 📬 Need Help?

If you face any issues or have questions, feel free to reach out:

📧 Email: shubharoy0024@gmail.com
