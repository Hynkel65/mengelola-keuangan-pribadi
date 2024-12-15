const express = require('express');
const incomeRouter = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Import income controller functions
const {
    getIncomes,
    addIncome,
    deleteIncome,
    updateIncome
} = require('../controllers/incomeController');

// Route for handling requests to the root path of incomes
incomeRouter
    .route('/')
    .get(getIncomes) // Handle GET requests to fetch all incomes
    .post(upload.single('image'), addIncome); // Handle POST requests to add a new income with an image upload

// Route for handling requests to a specific income by ID
incomeRouter
    .route('/:id')
    .delete(deleteIncome) // Handle DELETE requests to remove an income by ID
    .patch(updateIncome); // Handle PATCH requests to update an income by ID

module.exports = incomeRouter;