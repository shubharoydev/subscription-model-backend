require('dotenv').config(); // Load environment variables

const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const express = require('express');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const subscriptionRouter = require('./routes/subscription.routes');
const { connectDB } = require('./config/db'); // Import database connection
const { default: errorMiddleware } = require('./middleware/error.middleware');
const app = express();
const PORT = process.env.PORT || 8000;

connectDB(); //connect the database
app.use(errorMiddleware); // Error handling middleware
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: false})); // Middleware to parse URL-encoded requests
app.use(express.json()); // Middleware to parse JSON requests

app.use('/api/v1/auth', authRouter); // Authentication routes
app.use('/api/v1/users', userRouter); // User routes
app.use('/api/v1/subscriptions', subscriptionRouter); // Subscription routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
