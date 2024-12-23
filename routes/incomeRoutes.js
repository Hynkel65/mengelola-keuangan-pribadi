const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Import income controller functions
const {
    getIncomes,
    addIncome,
    deleteIncome,
    updateIncome
} = require('../controllers/incomeController');

// Route for handling requests to the root path of incomes
router
    .route('/')
    .get(getIncomes) // Handle GET requests to fetch all incomes
    .post(upload.single('image'), addIncome); // Handle POST requests to add a new income with an image upload

// Route for handling requests to a specific income by ID
router
    .route('/:id')
    .delete(deleteIncome) // Handle DELETE requests to remove an income by ID
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
    }, updateIncome); // Handle PATCH requests to update an income by ID with optional image upload

module.exports = router;