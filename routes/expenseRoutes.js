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
    .patch(upload.single('image'), (req, res, next) => {
        if (req.file && req.file.mimetype.startsWith('image/')) {
            // File is valid; proceed to controller
            next();
        } else if (req.file) {
            // Invalid file type
            return res.status(400).json({ success: false, error: 'Invalid file type. Only images are allowed.' });
        } else {
            // No file uploaded; continue with updating other fields
            next();
        }
    }, updateExpense); // PATCH request to update an expense by ID

// Export the router to be used in other parts of the application
module.exports = router;