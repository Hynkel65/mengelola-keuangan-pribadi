// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Import routes and middleware
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const userRoutes = require('./routes/userRoutes');
const { requireAuth } = require('./middleware/authMiddleware');
const { validateBudget, handleValidationErrors } = require('./middleware/budgetMiddleware');

// Import database connection
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Load environment variables from config file
dotenv.config({ path: './config/config.env' });

// Connect to the database
connectDB();

// Middleware setup
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Set security-related HTTP headers

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS with specific settings
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

// Trust the first proxy
app.set('trust proxy', 1);

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Route handling
app.use('/api/v1/incomes', requireAuth, incomeRoutes);
app.use('/api/v1/expenses', requireAuth, expenseRoutes);
app.use('/api/v1/budgets',requireAuth, validateBudget, budgetRoutes);
app.use('/api/v1/users', userRoutes);

// Development environment setup
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Log HTTP requests
}

// Production environment setup
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build')); // Serve static files from the client build directory

    // Serve the React app's index.html for any unknown routes
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});