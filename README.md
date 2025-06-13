# Subscription Model Backend

This project is a backend service for managing subscriptions, sending renewal reminders, and handling user authentication. It uses **Node.js, Express, MongoDB, and Nodemailer** for email notifications. The service integrates **Arcjet** for bot protection and rate limiting to ensure security and prevent abuse.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Arcjet Integration](#arcjet-integration)
- [API Routes](#api-routes)
  - [User Routes](#user-routes)
  - [Subscription Routes](#subscription-routes)
  - [Workflow Routes](#workflow-routes)


## Features
- User authentication (signup, signin) with JWT.
- Subscription management (create, read, update, delete).
- Automated renewal reminders via email using QStash workflows.
- Bot protection and rate limiting with Arcjet.
- MongoDB for data persistence.
- Email notifications using Nodemailer with Gmail.

## Prerequisites
- **Node.js**: v22.16.0 or higher
- **MongoDB**: A running MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- **Gmail Account**: For sending emails (with an App Password)
- **Upstash QStash**: For scheduling workflows
- **Arcjet**: For bot protection and rate limiting
- **Git**: To clone the repository

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shubharoydev/subscription-model-backend.git
   cd subscription-model-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the required variables (see [Environment Variables](#environment-variables)).

4. **Run the Server**:
   ```bash
   node server.js
   ```
   The server will run on `http://localhost:8000` (or the port specified in your `.env` file).

## Environment Variables
Create a `.env` file with the following variables:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/subscription_db
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
QSTASH_TOKEN=your_qstash_token
ARCJET_KEY=your_arcjet_key
ARCJET_ENV= development
JWT_SECRET_KEY = your_secure_random_string
JWT_EXPIRES_IN = 1h
QSTASH_URL= https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token

```

- `PORT`: The port on which the server runs.
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET_KEY`: Secret key for JWT token generation.
- `EMAIL_USER`: Gmail address for sending emails.
- `EMAIL_PASS`: Gmail App Password (generate from Google Account settings).
- `QSTASH_TOKEN`: Token for Upstash QStash to schedule workflows.
- `ARCJET_KEY`: API key for Arcjet bot protection and rate limiting.

## Arcjet Integration
This project uses **Arcjet** to protect against bots and enforce rate limiting on API endpoints. Arcjet is integrated into the Express middleware to secure sensitive routes like signup, signin, and subscription creation.

### Setup
 Install the Arcjet package:
   ```bash
   npm install @arcjet/node
   ```


### Protected Routes
- **Signup and Signin**: Protected against bots using Arcjet’s `shield` rule.
- **Subscription Creation**: Rate-limited to 10 requests per minute per IP.



## API Routes

All routes are prefixed with `/api/v1`.

### User Routes

#### 1. Signup

* **URL**: `/users/signup`
* **Method**: `POST`
* **Protected**: Arcjet bot protection
* **Required Fields**:

  * `name` (string)
  * `email` (string)
  * `password` (string)
* **Request Body Example**:

  ```json
  {
      "name": "Demo User",
      "email": "demo@example.com",
      "password": "demopassword123"
  }
  ```
* **Response**:

  ```json
  {
      "success": true,
      "message": "User created successfully",
      "data": {
          "_id": "demo_user_id",
          "name": "Demo User",
          "email": "demo@example.com",
          "createdAt": "2025-06-13T00:00:00.000Z"
      }
  }
  ```

#### 2. Signin

* **URL**: `/users/signin`
* **Method**: `POST`
* **Protected**: Arcjet bot protection
* **Required Fields**:

  * `email` (string)
  * `password` (string)
* **Request Body Example**:

  ```json
  {
      "email": "demo@example.com",
      "password": "demopassword123"
  }
  ```
* **Response**:

  ```json
  {
      "success": true,
      "message": "Signin successful",
      "token": "demo.jwt.token"
  }
  ```

### Subscription Routes

#### 1. Create Subscription

* **URL**: `/subscriptions`
* **Method**: `POST`
* **Protected**: JWT authentication, Arcjet rate limiting
* **Required Fields**:

  * `name` (string)
  * `price` (number)
  * `currency` (string)
  * `frequency` (string: "daily", "weekly", "monthly")
  * `category` (string)
  * `paymentMethod` (string)
  * `startDate` (string: ISO date)
  * `status` (string: "active", "inactive")
* **Request Body Example**:

  ```json
  {
      "name": "Demo Subscription",
      "price": 50,
      "currency": "USD",
      "frequency": "monthly",
      "category": "Demo Category",
      "paymentMethod": "Demo Card",
      "startDate": "2025-06-13",
      "status": "active"
  }
  ```
* **Response**:

  ```json
  {
      "success": true,
      "message": "Subscription created successfully",
      "data": {
          "_id": "demo_subscription_id",
          "name": "Demo Subscription",
          "price": 50,
          "currency": "USD",
          "frequency": "monthly",
          "category": "Demo Category",
          "paymentMethod": "Demo Card",
          "startDate": "2025-06-13T00:00:00.000Z",
          "renewalDate": "2025-07-13T00:00:00.000Z",
          "status": "active",
          "userId": "demo_user_id",
          "createdAt": "2025-06-13T00:00:00.000Z",
          "updatedAt": "2025-06-13T00:00:00.000Z"
      }
  }
  ```

#### 2. Get All Subscriptions

* **URL**: `/subscriptions`
* **Method**: `GET`
* **Protected**: JWT authentication
* **Query Parameters** (optional):

  * `status` (string: "active", "inactive")
* **Response**:

  ```json
  {
      "success": true,
      "data": [
          {
              "_id": "demo_subscription_id",
              "name": "Demo Subscription",
              "price": 50,
              "currency": "USD",
              "frequency": "monthly",
              "category": "Demo Category",
              "paymentMethod": "Demo Card",
              "startDate": "2025-06-13T00:00:00.000Z",
              "renewalDate": "2025-07-13T00:00:00.000Z",
              "status": "active",
              "userId": "demo_user_id",
              "createdAt": "2025-06-13T00:00:00.000Z",
              "updatedAt": "2025-06-13T00:00:00.000Z"
          }
      ]
  }
  ```

### Workflow Routes

#### 1. Send Reminder Email

* **URL**: `/workflows/subscription/reminder`
* **Method**: `POST`
* **Protected**: QStash authentication
* **Required Fields**:

  * `subscriptionId` (string)
* **Request Body Example**:

  ```json
  {
      "subscriptionId": "demo_subscription_id"
  }
  ```
* **Response**:

  ```json
  {
      "success": true,
      "message": "Reminder sent"
  }
  ```
* **Side Effect**:

  * Sends an email to the user’s email address (`demo@example.com`).

---

### 📅 **7 Days Before Reminder**

**Subject**:
📅 Reminder: Your Demo Subscription Renews in 7 Days!

**Body**:

```html
Hello <strong style="color: #4a90e2;">Demo User</strong>,  
Your <strong>Demo Subscription</strong> subscription is set to renew on <strong style="color: #4a90e2;">2025-06-20</strong> (7 days from today).

Plan: Demo Plan  
Price: INR 99/month  
Payment Method: Demo Card

If you'd like to make changes or cancel your subscription, please visit your [account settings](https://demo.account/settings) before the renewal date.  
Need help? [Contact our support team](https://demo.support/help) anytime.
```

---

### ⏳ **5 Days Before Reminder**

**Subject**:
⏳ Demo Subscription Renews in 5 Days – Stay Subscribed!

**Body**:

```html
Hello <strong style="color: #4a90e2;">Demo User</strong>,  
Your <strong>Demo Subscription</strong> subscription is set to renew on <strong style="color: #4a90e2;">2025-06-20</strong> (5 days from today).

Plan: Demo Plan  
Price: INR 99/month  
Payment Method: Demo Card

If you'd like to make changes or cancel your subscription, please visit your [account settings](https://demo.account/settings) before the renewal date.  
Need help? [Contact our support team](https://demo.support/help) anytime.
```

---

### 🚀 **2 Days Before Reminder**

**Subject**:
🚀 2 Days Left! Demo Subscription Renewal

**Body**:

```html
Hello <strong style="color: #4a90e2;">Demo User</strong>,  
Your <strong>Demo Subscription</strong> subscription is set to renew on <strong style="color: #4a90e2;">2025-06-20</strong> (2 days from today).

Plan: Demo Plan  
Price: INR 99/month  
Payment Method: Demo Card

If you'd like to make changes or cancel your subscription, please visit your [account settings](https://demo.account/settings) before the renewal date.  
Need help? [Contact our support team](https://demo.support/help) anytime.
```

---

### ⚡ **1 Day Before Reminder**

**Subject**:
⚡ Final Reminder: Demo Subscription Renews Tomorrow!

**Body**:

```html
Hello <strong style="color: #4a90e2;">Demo User</strong>,  
Your <strong>Demo Subscription</strong> subscription is set to renew on <strong style="color: #4a90e2;">2025-06-20</strong> (1 days from today).

Plan: Demo Plan  
Price: INR 99/month  
Payment Method: Demo Card

If you'd like to make changes or cancel your subscription, please visit your [account settings](https://demo.account/settings) before the renewal date.  
Need help? [Contact our support team](https://demo.support/help) anytime.
```

---



### Explanation of the README
1. **Project Overview**:
   - Describes the purpose of the project and its main features (user authentication, subscription management, email reminders, Arcjet security).
2. **Setup Instructions**:
   - Provides steps to clone the repository, install dependencies, set up environment variables, and run the server.
3. **Environment Variables**:
   - Lists all required environment variables with descriptions.
4. **Arcjet Integration**:
   - Explains how Arcjet is used for bot protection (`shield`) and rate limiting (`fixedWindow`), with setup instructions.
5. **API Routes**:
   - Documents all routes (`/users/signup`, `/users/signin`, `/subscriptions`, `/workflows/subscription/reminder`, `/workflows/test-email`) with:
     - URL, method, protection details, required fields, request body examples, and expected responses.

---

## 🌐 Live Deployment

The project is live and accessible at:

👉 **[https://subscription-model-backend.onrender.com](https://subscription-model-backend.onrender.com)**

---

## ⭐ Support & Contributions

If you like this project, please consider giving it a ⭐ on GitHub!

Contributions are welcome. To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a pull request

---

## 📫 Contact

For any queries or feedback, feel free to reach out via [GitHub Issues](https://github.com/shubharoydev/subscription-model-backend/issues) or shubharoy0024@gmail.com.
