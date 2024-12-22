const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Import controller functions for managing expenses
const {
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense
} = require('../controllers/expenseController');

// Route to handle operations on the collection of expenses
router
    .route('/')
    .get(getExpenses) // GET request to retrieve all expenses
    .post(upload.single('image'), addExpense); // POST request to add a new expense with an image upload

// Route to handle operations on a specific expense identified by ID
router
    .route('/:id')
    .delete(deleteExpense) // DELETE request to remove an expense by ID
    .patch(updateExpense); // PATCH request to update an expense by ID

// Export the router to be used in other parts of the application
module.exports = router;