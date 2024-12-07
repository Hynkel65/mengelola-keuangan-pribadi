const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const incomeRoutes = require('./routes/incomeRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const userRoutes = require('./routes/userRoutes')

const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(express.static(path.join(__dirname, '/')));
app.use('/api/v1', incomeRoutes);
app.use('/api/v1', expenseRoutes);
app.use('/api/v1', userRoutes);

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

if(process.env.NODE_ENV === 'production') {
     app.use(express.static('client/build'));
 
     app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
 }

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
