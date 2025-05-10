require('dotenv').config(); // Load environment variables

const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const express = require('express');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const { connectDB } = require('./config/db'); // Import database connection
const errorMiddleware = require('./middleware/error.middleware'); // Fixed import

const app = express();
const PORT = process.env.PORT || 8000;

connectDB(); // Connect the database

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/v1/auth', authRouter); // Authentication routes
app.use('/api/v1/users', userRouter); // User routes
app.use('/api/v1/subscriptions', subscriptionRouter); // Subscription routes

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});