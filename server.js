const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const userRoutes = require('./routes/userRoutes');
const { requireAuth } = require('./middleware/authMiddleware');
const { validateBudget, handleValidationErrors } = require('./middleware/budgetMiddleware');

const connectDB = require('./config/db');

const app = express();

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

app.use('/api/v1/incomes', requireAuth, incomeRoutes);
app.use('/api/v1/expenses', requireAuth, expenseRoutes);
app.use('/api/v1/budgets', requireAuth, validateBudget, budgetRoutes);
app.use('/api/v1/users', userRoutes);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});